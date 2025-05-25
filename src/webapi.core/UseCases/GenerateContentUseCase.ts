import fs from 'fs';
import { GoogleGenAI, createUserContent, Part, GenerateContentResponse, Type, GenerateContentConfig } from "@google/genai";
import { IGenerateContentUseCase } from "../Interfaces/UseCases/IGenerateContentUseCase.js"
import { IOutputPort } from "../Interfaces/IOutputPort.js";
import { UseCaseResponseMessage } from "../DTO/UseCaseResponse/UseCaseResponseMessage.js"
import { GenerateContentRequest } from "../DTO/UseCaseRequests/GenerateContentRequest.js"
import { Error } from "../DTO/Error.js"
import { ReceiptModel } from "../DTO/ReceiptModel.js"
import { injectable, inject } from "inversify";
import { ILogger, LogLevels } from "../Interfaces/ILogger.js";
import { LoggerTypes, RepositoryTypes } from "../types.js";
import e from "express";
@injectable()
export class GenerateContentUseCase implements IGenerateContentUseCase {
  private _logger: ILogger;
  private readonly _genAI: GoogleGenAI;
  public constructor(@inject(LoggerTypes.ILogger) logger: ILogger) {
    this._logger = logger;
    this._genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }
  private FileToGenerativePart (path: string, mimeType: string) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType,
      },
    };
  }
  // Retrieve students who are registered to ALL of the given teachers:
  public async Handle (request: GenerateContentRequest, outputPort: IOutputPort<UseCaseResponseMessage>): Promise<Boolean> {
    let errors: Error[] = [];
    let response: UseCaseResponseMessage;
    try {
      this._logger.Log(LogLevels.debug, 'POST /api/gemini query: ' + JSON.stringify(request, null, 2));
      if (request.Prompt) {
        let result: GenerateContentResponse;
        let config: GenerateContentConfig = {};
        if (request.IsReceipt)
          config = {
            systemInstruction: "You are an OCR expert. You will extract details and information from an image and return structured data to the user.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              description: "Schema for a receipt",
              properties: {
                Date: {
                  type: Type.STRING,
                  description: "Date of the receipt",
                },
                Vendor: {
                  type: Type.STRING,
                  description: "The vendor or merchant which issued the receipt",
                },
                Items: {
                  type: Type.ARRAY,
                  description: "List of items spent in the receipt. Every item should have the name and amount spent for the item.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      Name: {
                        type: Type.STRING,
                        description: "The name of the item spent on the receipt.",
                      },
                      Amount: {
                        type: Type.NUMBER,
                        description: "The name of the item spent on the receipt.",
                      },
                    },
                    propertyOrdering: ["Name", "Amount"],
                    description: "Every item in the receipt should have the name first followed with the amount."
                  },
                },
                Currency: {
                  type: Type.STRING,
                  description: "Currency used in the Amount of items, TaxAmount and Total of the receipt",
                },
                TaxAmount: {
                  type: Type.NUMBER,
                  description: "The GST/Tax amount payable on the total of all the items' amount."
                },
                Total: {
                  type: Type.NUMBER,
                  description: "The total amount spend on the receipt which includes the total of the items' amount and the TaxAmount",
                },
              },
              propertyOrdering: ["Date", "Vendor", "Items", "Currency", "TaxAmount", "Total"],
              required: ["Date", "Currency", "Vendor", "TaxAmount", "Total"],
            },
          };
        if (request.Image) {
          this._logger.Log(LogLevels.debug, `Reading uploaded file from ${request.Image.Path}`);
          let imagePart: Part = this.FileToGenerativePart(request.Image.Path, request.Image.MimeType);
          result = await this._genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [
              createUserContent([
                request.Prompt,
                imagePart,
              ]),
            ],
            /*
            https://ai.google.dev/gemini-api/docs/structured-output
            */
            config: config
          });
          fs.unlink(request.Image.Path, (err) => {
            if (err) throw err;
            this._logger.Log(LogLevels.debug, `${request!.Image!.Path} was deleted successfully`);
          });
        } else {
          result = await this._genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: request.Prompt
          });
          /*result = new GenerateContentResponse()
          result.text = "Task decomposition is the process of breaking down a complex task or problem into smaller, more manageable, and understandable sub-tasks.  Think of it as taking a large project and dividing it into smaller, actionable steps.\
                    \
                    Here's a breakdown of the key aspects:\
                    \
                    *   ** Breaking Down Complexity:** The primary goal is to simplify a difficult or overwhelming task into bite- sized pieces.\
                    *   ** Manageability:** Smaller tasks are easier to plan, execute, and monitor.It's much easier to estimate the time and resources needed for a small task than a large, vague one.\
            *   ** Understandability:** Each sub - task is more focused and has a clearer purpose, making it easier to understand what needs to be done.\
                    *   ** Actionable Steps:** The result of decomposition should be a set of concrete steps that can be directly worked on.\
                    *   ** Hierarchy(Often):** Task decomposition often results in a hierarchical structure, where the main task sits at the top, and sub - tasks branch out below it.These sub - tasks might even be further decomposed into even smaller sub - sub - tasks.\
                    *   ** Parallelization(Potential):** Decomposed tasks can sometimes be performed in parallel, speeding up the overall completion time.\
                    *   ** Collaboration(Facilitation):** Smaller tasks can be easily assigned to different individuals or teams, facilitating collaboration.\
                    *   ** Iterative Process:** Task decomposition is often an iterative process.You might start with a high - level breakdown and then refine the sub - tasks further as you gain a better understanding of the problem.\
                    \
                    ** Why is Task Decomposition Important ?**\
                    \
                    *   ** Improved Efficiency:** Makes it easier to plan and execute tasks, leading to increased efficiency.\
                    *   ** Better Organization:** Provides a structured approach to tackling complex problems.\
                    *   ** Reduced Stress:** Large, overwhelming tasks can cause stress.Decomposition helps reduce this by making the task feel more manageable.\
                    *   ** Enhanced Collaboration:** Facilitates teamwork by allowing tasks to be divided and assigned.\
                    *   ** Easier Tracking and Monitoring:** Allows for better tracking of progress and identification of potential roadblocks.\
                    *   ** Improved Estimates:** Smaller tasks are easier to estimate in terms of time, resources, and effort.\
                    *   ** Problem Solving:** Forces you to think critically about the task and identify its key components.\
                    \
                    ** Examples of Task Decomposition:**\
                    \
                    *   ** Writing a Report:**\
                        * Research the topic\
                        * Outline the report\
                        * Write the introduction\
                        * Write the body paragraphs(further decomposed by section)\
                        * Write the conclusion\
                        * Edit and proofread the report\
                        * Format the report\
                    *   ** Planning a Vacation:**\
                        * Determine the budget\
                        * Choose a destination\
                        * Book flights\
                        * Book accommodation\
                        * Plan activities\
                        * Pack your bags\
                    *   ** Building a Website:**\
                        * Define the website's purpose and target audience.\
                        * Plan the website's structure (sitemap).\
                        * Design the layout and user interface.\
                        * Develop the front - end(HTML, CSS, JavaScript).\
                        * Develop the back - end(server - side logic, database).\
                        * Test the website.\
                        * Deploy the website.\
                        * Maintain and update the website.\
                    \
                    ** In Summary:**\
                    \
                    Task decomposition is a valuable technique for managing complexity, improving efficiency, and enhancing collaboration.It involves breaking down a large, intimidating task into smaller, more manageable pieces, making it easier to plan, execute, and ultimately achieve the desired outcome."};*/
        }
        if (result && result.text) {
          if (request.IsReceipt === true) {
            this._logger.Log(LogLevels.debug, `Parse receipt object...`);
            let receipt: ReceiptModel = JSON.parse(result.text);
            this._logger.Log(LogLevels.debug, `receipt: ${JSON.stringify(receipt, null, 2)}`);
          }
          let text = result.text.replace('```json', '')
          text = text.replace('```', '')
          response = new UseCaseResponseMessage("", true, result.text, errors);
          this._logger.Log(LogLevels.debug, `Prompt: ${request.Prompt} generates: ${response.Message}`);
        } else {
          this._logger.Log(LogLevels.error, `Prompt ${request.Prompt} fails to generate result!`);
          response = new UseCaseResponseMessage("", false, `Prompt ${request.Prompt} fails to generate result!`, errors);
        }
      } else {
        this._logger.Log(LogLevels.error, `Invalid prompt! ${request.Prompt}!`);
        response = new UseCaseResponseMessage("", false, `Invalid prompt! ${request.Prompt}`, errors);
      }
      outputPort.Handle(response);
      return response.Success;
    } catch (e) {
      console.error(e);
      if (typeof e === "string") {
        this._logger.Log(LogLevels.error, `Exception! ${e}`);
        errors.push(new Error("", e));
        response = new UseCaseResponseMessage("", false, e, errors);
      } else {
        this._logger.Log(LogLevels.error, `Exception! ${JSON.stringify(e, null, 2)}`);
        errors.push(new Error("", JSON.stringify(e, null, 2)));
        response = new UseCaseResponseMessage("", false, "Exception!", errors);
      }
      outputPort.Handle(response);
      return false;
    }
  }
}