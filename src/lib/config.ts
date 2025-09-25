// src/lib/config.ts
const file = Bun.file("$lib/dataset/main.yaml");

const text = await file.text();
const data = Bun.YAML.parse(text);

export default data;
