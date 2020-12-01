import Route from "~Route";

export default class Router {

    public mode: string = 'history'

    public root: string = '/'

    private routes: RoutesCollection = []

    private current: string = null

    private interval: number = null

    private previous: string[] = []

    constructor(options: RouterOptions = {}) {
        this.mode = window.history.pushState ? 'history' : 'hash'

        if (options.mode) {
            this.mode = options.mode
        }

        if (options.root) {
            this.root = options.root
        }

        if (options.routes) {
            for (let route of options.routes) {
                this.add(route.path, route.callback, route.name)
            }
        }

        this.watchUrl = this.watchUrl.bind(this)

        this.listen()
    }

    add(path: string, cb: Function, name?: string): Router {
        this.routes.push(
            // @ts-ignore
            new Route(path, cb, name)
        )

        return this
    }

    remove(path: string): Router {
        this.routes = this.routes.filter(route => route.path !== path)

        return this
    }

    back() {
        if (this.mode === 'history') {
            window.history.back()
        }
    }

    forward() {
        if (this.mode === 'history') {
            window.history.forward()
        }
    }

    flush(): Router {
        this.routes = []

        return this
    }

    navigate(options: NavigationOptions = {}): Router {
        let path: string

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

        if (!path) {
            return
        }

        if (this.mode === 'history') {
            window.history.pushState(null, null, this.root + this.clearSlashes(path))
        } else {
            const href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`

            this.previous.unshift(href)

            window.location.href = href
        }

        return this
    }

    clearSlashes(path: string) {
        return path
            .toString()
            .replace(/\/$/, '')
            .replace(/^\//, '')
    }

    getFragment(): string {
        let fragment: string

        if (this.mode === 'history') {
            fragment = this.clearSlashes(decodeURI(window.location.pathname + window.location.search))
            fragment = fragment.replace(/\?(.*)$/, '')
            fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment
        } else {
            const match = window.location.href.match(/#(.*)$/)

            fragment = match ? match[1] : ''
        }
        return this.clearSlashes(fragment)
    }

    listen(): void {
        clearInterval(this.interval)

        this.interval = setInterval(this.watchUrl, 50)
    }

    watchUrl(): void {
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
}

if (window && document) {
    window['Router'] = Router
}
