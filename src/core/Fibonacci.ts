export class Fibonacci {
    public fibonacci (n: number) {
        if (n <= 1)
            return 1;
        else {
            // return fib(n-2) + fib(n-1)
            let result = [0, 1]
            for (let i = 2; i < n + 1; i++) {
                result[i % 2] = result[(i - 2) % 2] + result[(i - 1) % 2];
            }
            return result[n % 2];
        }
    }
}