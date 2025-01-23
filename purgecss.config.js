module.exports = {
    content: ["./blog/ai.html", "./assets/js/blog.js"],
    css: ["blog.css"],
    output: "./assets/css/",
    safelist: {
      standard: [/trigger/, /popover/, /progress/], // Prevent removal of dynamic classes
    },
  };
  