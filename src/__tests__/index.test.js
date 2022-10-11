const { pickHmoPlans } = require("helpers/func");

const plan = [
  { name: "kles", planId: "g343rer" },
  { name: "desser", planId: "g343rer", type: "normal" },
];
const pickArr = ["name", "planId"];

const toBeSample = [
  { name: "kles", planId: "g343rer" },
  { name: "desser", planId: "g343rer" },
];

describe("Testing pickHmoPlans function", () => {
  it("Should be able to pick out the required fields from the array of objects and return a new array.", () => {
    expect(pickHmoPlans(plan, pickArr)).toEqual(toBeSample);
  });
});
