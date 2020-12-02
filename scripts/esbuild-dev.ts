import { startService } from "esbuild"
import { FSWatcher, watch } from "chokidar"

const noop = () => {}

const updateLine = (input: string, isBuiltInput: boolean = false) => {
    const numberOfLines = (input.match(/\n/g) || []).length
    process.stdout.cursorTo(0, 2)
    process.stdout.clearScreenDown()
    process.stdout.write(input)
    isBuiltInput ? process.stdout.moveCursor(0, -numberOfLines) : noop()
}

const build = async () => {
    const service = await startService()

    try {
        process.stdout.cursorTo(0, 2)
        process.stdout.clearLine(0)

        const timerStart = Date.now()
        // esbuild --minify --bundle --sourcemap --target=chrome58,firefox57,safari11,edge16 --outfile=dist/router.min.js src/Router.ts
        await service.build({
            color: true,
            entryPoints: ["./src/Router.ts"],
            outfile: "./dist/router.min.js",
            minify: true,
            bundle: true,
            sourcemap: true,
            tsconfig: "./tsconfig.json",
            platform: "browser",
            target: ["chrome58", "firefox57", "safari11", "edge16"],
            logLevel: "error",
        })

        const timerEnd = Date.now()

        updateLine(`Built in ${timerEnd - timerStart}ms.`, true)
    } catch (e) {
        console.error(e)
    } finally {
        service.stop()
    }
}

const watcher = watch(["src/**/*"]) as FSWatcher

(async function () {
    console.log("Watching files... \n")

    await build()

    watcher.on("change", async () => {
        await build()
    })
})()
