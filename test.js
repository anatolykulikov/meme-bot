const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function getMeme(userId) {
  const params = new URLSearchParams();
  params.append("user_id", userId);

  const res = await fetch(`${BASE_URL}/mem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  return res.json();
}

function extractImageUrl(response) {
  return response.attachments?.[0]?.image_url;
}

// === ТЕСТЫ ===

async function testSameUserSameMeme() {
  console.log("🔁 Тест: один пользователь — один мем");

  const a = await getMeme("alice");
  const b = await getMeme("alice");

  const urlA = extractImageUrl(a);
  const urlB = extractImageUrl(b);

  if (urlA === urlB) {
    console.log("✅ OK");
  } else {
    console.log("❌ FAIL");
    console.log(urlA, urlB);
  }
}

async function testDifferentUsersDifferentMemes() {
  console.log("👥 Тест: разные пользователи");

  const a = await getMeme("alice");
  const b = await getMeme("bob");

  const urlA = extractImageUrl(a);
  const urlB = extractImageUrl(b);

  if (urlA !== urlB) {
    console.log("✅ OK (скорее всего разные)");
  } else {
    console.log("⚠️ одинаковые (возможно мало мемов)");
  }
}

async function testImageAccessible() {
  console.log("🖼️ Тест: доступность картинки");

  const res = await getMeme("alice");
  const imageUrl = extractImageUrl(res);

  const imgRes = await fetch(imageUrl);

  if (imgRes.ok) {
    console.log("✅ картинка доступна");
  } else {
    console.log("❌ картинка НЕ доступна:", imageUrl);
  }
}

async function testPersistence() {
  console.log("💾 Тест: проверка remember");

  const user = "persist_test";

  const first = await getMeme(user);
  const second = await getMeme(user);

  if (extractImageUrl(first) === extractImageUrl(second)) {
    console.log("✅ сохраняется корректно");
  } else {
    console.log("❌ не сохраняется");
  }
}

// === ЗАПУСК ===

async function run() {
  try {
    console.log("🚀 Запуск тестов\n");

    await testSameUserSameMeme();
    await testDifferentUsersDifferentMemes();
    await testImageAccessible();
    await testPersistence();

    console.log("\n🎉 Готово");
  } catch (err) {
    console.error("💥 Ошибка:", err.message);
  }
}

run();