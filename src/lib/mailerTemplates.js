const mailerTemplates = require("./mailerTemplates.json");

/**
 * @param {string} name Name of template
 * @param {...string} [args] Template arguments
 * @returns {string} 
 */
function template(name, ...args) {
  const data = mailerTemplates[name];

  if(!data) 
    throw new ReferenceError("Mail template doesn't exists. Name: " + name);

  return data.replace(/\{\{\d+\}\}/g, v => {
    const i = v.match(/(\d+)/)[1];
    return args[parseInt(i)] ?? "undefined";
  });
}

module.exports = template;

module.exports.default = template;
