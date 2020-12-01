declare type RouterOptions = {
    mode?: string
    root?: string
    routes?: RouteOption[]
}

declare type RouteOption = {
    path: string
    callback: Function
    name?: string
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
    private previous: string[]

    constructor(options: RouterOptions)

    public add(path: string, cb: Function, name?: string): Router
    public remove(path: string): Router
    public navigate(path: string, params: object): Router

    public flush(): Router
    private clearSlashes(path: string): string
    private matchRoute(): void

}
