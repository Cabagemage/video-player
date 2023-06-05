export default function throttle<T extends Function>(callback: T, limit: number): T {
    let waiting = false;
    return function(this: unknown, ...args: unknown[]) {
        if (!waiting) {
            callback.apply(this, args);
            waiting = true;
            setTimeout(() => {
                waiting = false;
            }, limit);
        }
    } as T;
}