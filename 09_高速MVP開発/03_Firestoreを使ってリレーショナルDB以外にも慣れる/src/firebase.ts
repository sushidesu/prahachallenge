import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
// 参考: https://qiita.com/access3151fq/items/eed16862893dc004d404
// @deno-types="https://cdn.esm.sh/v57/firebase@9.8.1/app/dist/app/index.d.ts"
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
// @deno-types="https://cdn.esm.sh/v58/firebase@9.8.1/firestore/dist/firestore/index.d.ts"
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";

const env = config();

const app = initializeApp({
  projectId: env.FIREBASE_PROJECT_ID,
});

export const firestore = getFirestore(app);
