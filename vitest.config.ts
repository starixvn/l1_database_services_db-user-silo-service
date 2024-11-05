// import { configDefaults, mergeConfig, type ViteUserConfig } from "vitest/config";

// const userConfig = {
//     test: {
//         include: ["src/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
//         coverage: {
//             include: ["src/**/*.?(c|m)[jt]s?(x)"],
//         },
//     },
// } as const satisfies ViteUserConfig;

// export const defaultConfig = mergeConfig(configDefaults, userConfig);

// export default defaultConfig;

import { defaultConfig } from "@ldb/vitest-config";
export default defaultConfig;
