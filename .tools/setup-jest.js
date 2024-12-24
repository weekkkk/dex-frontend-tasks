const { TextEncoder, TextDecoder } = require("util");

// Добавляем TextEncoder и TextDecoder в глобальную область
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
