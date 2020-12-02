declare type RouterOptions = {
    mode?: string
    root?: string
    routes?: RouteOption[]
}

declare type RouteOption = {
    path: string
    callback: Function
    name?: string,
    group?: string
}

declare type NavigationOptions = {
    path?: string
    name?: string
    params?: Params
}

declare type RoutesCollection = Route[]

declare class Router {

    public mode: string
    public root: string

    private routes: RoutesCollection
    private current: string
    private interval: number
    private previous: string[]
    private prefixes: string[]

    constructor(options: RouterOptions)

    public add(path: string, cb: Function, name?: string): Router
    public remove(path: string): Router
    public navigate(options: NavigationOptions|string): Router
    public flush(): Router
    public back(): void
    public forward(): void
    public group(prefix: string, callback: Function): Router

    private defineRoutes(routes: RouteOption[]): void
    private getFragment(): string
    private listen(): void
    private watchUrl(): void

    private static clearSlashes(path: string): string

}
