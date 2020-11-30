export default class Route {

    public path: string = null

    public params?: string[] = []

    public callback: Function = null

    public name: string = null

    private readonly regex_path: RegExp = null

    constructor(path: string, callback: Function, name: string = null) {
        this.path = path
        this.params = path.match(/(:\w+)/gi) || []
        this.callback = callback
        this.name = name
        this.regex_path = new RegExp("^" + path.replace(/:[^\s/]+/g, '([\\w-]+)') + "$")
    }

    public match(path: string): RouteMatch|null {
        const match = path.match(this.regex_path)

        if (match === null) {
            return null
        }

        match.shift()

        return {
            path: this.path,
            callback: this.callback,
            name: this.name,
            params: match.reduce((acc, value, index) => {
                if (this.params[index]) {
                    const key = this.params[index].replace(':', '')

                    acc[key] = value
                }

                return acc
            }, {})
        }
    }

}