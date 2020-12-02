import Route from "~Route";

export default class Router {

    public mode: string = 'history'

    public root: string = '/'

    private routes: RoutesCollection = []

    private current: string = null

    private interval: number = null

    private previous: string[] = []

    private prefixes: string[] = []

    constructor(options: RouterOptions = {}) {
        this.mode = window.history.pushState ? 'history' : 'hash'

        if (options.mode) {
            this.mode = options.mode
        }

        if (options.root) {
            this.root = options.root
        }

        if (options.routes) {
            this.defineRoutes(options.routes)
        }

        this.watchUrl = this.watchUrl.bind(this)

        this.listen()
    }

    public add(path: string, cb: Function, name?: string): Router {
        if (this.prefixes.length > 0) {
            path = this.prefixes.join('/') + '/' + path
        }

        this.routes.push(
            // @ts-ignore
            new Route(Router.clearSlashes(path), cb, name)
        )

        return this
    }

    public remove(path: string): Router {
        this.routes = this.routes.filter(route => route.path !== path)

        return this
    }

    public back(): void {
        if (this.mode === 'history') {
            window.history.back()
        }
    }

    public forward(): void {
        if (this.mode === 'history') {
            window.history.forward()
        }
    }

    public flush(): Router {
        this.routes = []

        return this
    }

    public navigate(options: NavigationOptions|string = {}): Router {
        let path: string

        if (typeof options === 'string') {
            path = options
        } else {
            if (options.name) {
                const params = options.params || {};

                const route = this.routes.find(route => route.name === options.name)

                if (route) {
                    path = route.path

                    for (let key in params) {
                        if (params.hasOwnProperty(key)) {
                            path = path.replace(':' + key, params[key])
                        }
                    }
                }
            } else {
                path = options.path
            }
        }

        if (!path) {
            return
        }

        if (this.mode === 'history') {
            window.history.pushState(null, null, this.root + Router.clearSlashes(path))
        } else {
            const href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`

            this.previous.unshift(href)

            window.location.href = href
        }

        return this
    }

    public group(prefix: string, callback: Function): Router {
        this.prefixes.unshift(
            Router.clearSlashes(prefix)
        )

        callback.apply(this)

        this.prefixes.shift()

        return this
    }

    private defineRoutes(routes: RouteOption[]): void {
        for (let route of routes) {
            if (route.group) {
                this.group(route.group, () => {
                    this.add(route.path, route.callback, route.name)
                })
            } else {
                this.add(route.path, route.callback, route.name)
            }
        }
    }

    private getFragment(): string {
        let fragment: string

        if (this.mode === 'history') {
            fragment = Router.clearSlashes(decodeURI(window.location.pathname + window.location.search))
            fragment = fragment.replace(/\?(.*)$/, '')
            fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment
        } else {
            const match = window.location.href.match(/#(.*)$/)

            fragment = match ? match[1] : ''
        }
        return Router.clearSlashes(fragment)
    }

    private listen(): void {
        clearInterval(this.interval)

        this.interval = setInterval(this.watchUrl, 50)
    }

    private watchUrl(): void {
        if (this.current === this.getFragment()) {
            return
        }

        this.current = this.getFragment()

        for (let route of this.routes) {
            let match = route.match(this.current)

            if (match !== null) {
                let params = [
                    ...Object.values(match.params),
                    this.current,
                    route
                ]

                match.callback.apply(this, params)

                break;
            }
        }
    }

    private static clearSlashes(path: string) {
        return path.toString().replace(/(^\/)|(\/$)/ig, '')
    }
}

if (window && document) {
    window['Router'] = Router
}
