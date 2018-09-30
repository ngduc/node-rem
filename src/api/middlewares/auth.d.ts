declare module 'Promise' {
  export function promisify<T>(
    func: (data: any, cb: (err: NodeJS.ErrnoException, data?: T) => void) => void
  ): (...input: any[]) => Promise<T>;
}
