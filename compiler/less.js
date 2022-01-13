const Less = require("less");
const LessCleanCss = require("less-plugin-clean-css");
const { join } = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "src", "public");
const PAGS = join(PUBLIC, "less", "pags");
const PAGS_CSS = join(PUBLIC, "css", "pags");
const PREFABS = join(PUBLIC, "less", "prefabs");
const PREFABS_CSS = join(PUBLIC, "css", "prefabs");

/**
 * @param {string} file
 * @param {{ input: string, output: string }} dir
 * @param {number} [level=0]
 * @returns {Promise<void>}
 */
function compileFile(file, dir, level = 0) {
  return new Promise((resolve, reject) => {
    const spaces = " ".repeat(level * 2);
    console.log(
      `${spaces}\x1b[0;33m|\x1b[0;32m ${file
        .replace(dir.input, "")
        .replaceAll("\\", "/")}\x1b[0m`
    );
    Less.render(
      fs.readFileSync(file, "utf8"),
      {
        plugins: [LessCleanCss],
        paths: [dir.input],
      },
      async (err, output) => {
        if (err) {
          reject(err);
        } else {
          const _target = join(dir.output, file.replace(dir.input, ""));
          const ext = _target.split(".").pop();
          const target = _target.replace(new RegExp(ext + "$"), "css");

          try {
            await fsPromises.mkdir(dir.output, { recursive: true });
          } catch {}

          fsPromises
            .writeFile(target, output.css)
            .then(() => {
              resolve();
            })
            .catch(reject);
        }
      }
    );
  });
}

/**
 * @param {string} input
 * @param {string} output
 * @param {string} top
 * @param {number} [level=0]
 */
async function compileDir(input, output, top, level = 0) {
  const spaces = " ".repeat(level * 2);
  console.log(
    `${spaces}\x1b[0;1;33m|-\x1b[0;1;36m ${input
      .replace(top, "")
      .replaceAll("\\", "/")}\x1b[0m`
  );

  const files = await fsPromises.readdir(input);

  try {
    await fsPromises.rm(output, { recursive: true });
  } catch {}

  for (const file of files) {
    const target = join(input, file);

    if ((await fsPromises.stat(target)).isDirectory()) {
      const dir = {
        input: join(input, file),
        output: join(output, file),
      };

      await compileDir(dir.input, dir.output, input, level + 1);
    } else {
      await compileFile(target, { input, output }, level);
    }
  }

  console.log(`${spaces}\x1b[0;1;33m|- \x1b[0;1;36m\x1b[0m`);
}

console.log(
  `\x1b[0;33mCompiling ${PAGS.replace(ROOT, "").replaceAll("\\", "/")}\x1b[0m`
);
compileDir(PAGS, PAGS_CSS, PUBLIC, 0.5)
  .then(() => {
    console.log(
      `\x1b[0;33mCompiled ${PAGS.replace(ROOT, "").replaceAll(
        "\\",
        "/"
      )}\x1b[0m\n`
    );
    console.log(
      `\x1b[0;33mCompiling ${PREFABS.replace(ROOT, "").replaceAll(
        "\\",
        "/"
      )}\x1b[0m`
    );
  })
  .then(() => {
    compileDir(PREFABS, PREFABS_CSS, PUBLIC, 0.5).then(() => {
      console.log(
        `\x1b[0;33mCompiled ${PREFABS.replace(ROOT, "").replaceAll(
          "\\",
          "/"
        )}\x1b[0m\n`
      );
    });
  });
