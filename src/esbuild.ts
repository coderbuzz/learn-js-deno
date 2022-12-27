import { esbuild } from './deps.ts';

/* example esbuild */
esbuild
  .build({
    entryPoints: ["./src/mod.ts"],
    outfile: "./dist/bundle.js",
    format: "esm",
    bundle: true,
    minify: true,
    sourcemap: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("watch build succeeded:", result);
      },
    },
  })
  .then(() => {
    console.log('done');
  });