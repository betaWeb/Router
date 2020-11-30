declare class Route {

    public path: string
    public params?: string[]
    public callback: Function
    public name?: string

    private readonly regex_path: RegExp

    public match(path: string): boolean

    constructor(path: string, callback: Function, name: string)

}

declare type RouteMatch = {
    path: string
    callback: Function
    name: string
    params: Params
}

declare type Params = {
    [key: string]: string
}