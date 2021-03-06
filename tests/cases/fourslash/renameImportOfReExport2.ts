/// <reference path='fourslash.ts' />

////declare module "a" {
////    export class [|{| "isWriteAccess": true, "isDefinition": true |}C|] {}
////}
////declare module "b" {
////    export { [|C|] as [|{| "isWriteAccess": true, "isDefinition": true |}D|] } from "a";
////}
////declare module "c" {
////    import { [|{| "isWriteAccess": true, "isDefinition": true |}D|] } from "b";
////    export function f(c: [|D|]): void;
////}

verify.noErrors();

const ranges = test.rangesByText();
const cRanges = ranges.get("C");
const dRanges = ranges.get("D");
const [d0, d1, d2] = dRanges;

const classes = { definition: "class C", ranges: cRanges };
const bImports = { definition: "(alias) class D\nexport D", ranges: [d0] };
const cImports = { definition: "(alias) class D\nimport D", ranges: [d1, d2] };
verify.referenceGroups(cRanges, [classes, bImports, cImports]);

verify.referenceGroups(d0, [bImports, cImports]);
verify.referenceGroups([d1, d2], [cImports, bImports]);

verify.rangesAreRenameLocations(cRanges);
verify.renameLocations(cRanges[1], cRanges);
verify.renameLocations(d0, dRanges);
verify.renameLocations([d1, d2], [{ range: d1, prefixText: "D as " }, d2]);
