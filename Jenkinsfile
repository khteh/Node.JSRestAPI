import groovy.json.JsonBuilder
@Library('common-libs@master') _
try {
    def err = null
	def version = "latest"
    properties([
        //pipelineTriggers([pollSCM('H/60 * * * 1-5')]),
        parameters([
            choice( name: 'runVulnerabilityScan', choices: "Disable\nEnable", description: 'Enable or Disable Vulnerability Scan' )
        ])
    ])
    timeout(time: 20, unit: 'MINUTES') {
		//println groovy.json.JsonOutput.prettyPrint(groovy.json.JsonOutput.toJson(env))
        def appName="${env.APPLICATION_NAME}".toLowerCase()
        def SOURCE_BRANCH="${env.GIT_BRANCH}"
        def DESTINATION_BRANCH="master"
        def nexusSnapRepo="nodejsnamespace-maven-snapshots"
        def helmRepo="https://github.com/khteh/kubernetes"
        def helmchartBranch="master"
        def helmchartPath="HelmCharts"
        node {
            stage("Initialize") {
				project = env.PROJECT_NAME
				//sh 'printenv'
            }
        }
		podTemplate(label: "${project}-${appName}-${scm.branches[0].name}-${env.BUILD_ID}", 
            cloud: "openshift", 
			namespace: "nodejsnamespace",
            inheritFrom: "nodejs", 
            containers: [
				containerTemplate(name: "jnlp", 
					image: "image-registry.openshift-image-registry.svc:5000/nodejsnamespace/jenkins-agent-nodejs-12-rhel7:latest", 
					envVars: [
						envVar(key: "workingDir", value: "/tmp"),
						envVar(key: "JENKINS_AGENT_WORKDIR", value: "/tmp"),
						envVar(key: "no_proxy", value: "true")
					]
				)
			],
			volumes: [
				configMapVolume(mountPath: "/tmp/sonarqube", configMapName: "sonarcacert")
			]						
			) {		
        node("${project}-${appName}-${scm.branches[0].name}-${env.BUILD_ID}") {
            stage("Checkout SCM") {
				checkout scm
				//println scm.dump()
            }
            stage("Build") {
				echo "${appName} Build #${env.BUILD_ID} branch ${scm.branches[0].name}"
				sh "npm install"
            }
            stage("Test") {
				ciBuildNodeJSTests()
            }
			stage("Coverage") {
				ciBuildQualityCheckNodeJS(app: appName)
			}
			stage("Build Docker Image") {
				version = ciBuildReadNodeJSVersion() + ".${env.BUILD_ID}"
				ciBuildNodeJSDocker(app: appName, proj: project, version: version)
			}
            if (env.runVulnerabilityScan == 'Enable') {
                stage('Vulnerability Analysis'){
                    // Scans vulnerability on maven dependencies...
                    ciBuildVulnerabilityCheck()
                }
            }
		}
		}
		podTemplate(label: "helm-slave", 
            cloud: "openshift", 
            inheritFrom: "helm", 
            containers: [
				containerTemplate(name: "jnlp", 
                image: "image-registry.openshift-image-registry.svc:5000/openshift/jenkins-agent-ansible:latest", 
                resourceRequestMemory: "512Mi", 
                resourceLimitMemory: "512Mi", 
                envVars: [
					envVar(key: "CONTAINER_HEAP_PERCENT", value: "0.25"),
					envVar(key: "workingDir", value: "/tmp"),
					envVar(key: "JENKINS_AGENT_WORKDIR", value: "/tmp"),
					envVar(key: "no_proxy", value: "true")
				])
			]) {
			node("helm-slave") {
				// Deploy to SIT if it is "develop" branch, UAT if it is "master" branch
				stage("Deployment") {
					cdDeployOpenShiftStatefulSet(app: appName, hcrepo: helmRepo, nsp: project, hcbranch: helmchartBranch, helmchartPath: helmchartPath, version: version)
				}
			}
		}
    }
} catch (err) {
    echo "in catch block"
    echo "Caught: ${err}"
    currentBuild.result = 'FAILURE'
    throw err
} finally {
    //ciBuildSendMail()
}