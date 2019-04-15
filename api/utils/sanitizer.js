const entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
}

const sanitizeHtml = (html) => {
  return String(html).replace(/[&<>"'\/]/g, key => entityMap[key])
}

module.exports = {
  sanitizeHtml
}
