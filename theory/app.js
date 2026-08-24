const topicFiles = [
  "01-cost.html",
  "02-expense.html",
  "03-security.html",
  "04-note.html",
  "05-baddebt.html",
  "06-tax.html",
  "07-suspense.html",
  "08-cash.html",
];

async function loadTopics() {
  const mount = document.getElementById("topics");

  try {
    const fragments = await Promise.all(
      topicFiles.map(async (file) => {
        const response = await fetch(`sections/${file}`);
        if (!response.ok) throw new Error(`${file} 불러오기 실패`);
        return response.text();
      }),
    );

    mount.innerHTML = fragments.join("\n");
    const topics = Array.from(document.querySelectorAll(".topic"));

    document.getElementById("expandAll").addEventListener("click", () => {
      topics.forEach((topic) => { topic.open = true; });
    });

    document.getElementById("collapseAll").addEventListener("click", () => {
      topics.forEach((topic) => { topic.open = false; });
    });

    if (location.hash) {
      requestAnimationFrame(() => {
        document.querySelector(location.hash)?.scrollIntoView();
      });
    }
  } catch (error) {
    mount.innerHTML = `<div style="margin:18px 0;padding:18px;border:1px solid #efb7bd;border-radius:16px;background:#fff0f2;color:#b52e3a;font-weight:800;text-align:center">내용을 불러오지 못했습니다. 페이지를 새로고침해 주세요.</div>`;
    console.error(error);
  }
}

loadTopics();
