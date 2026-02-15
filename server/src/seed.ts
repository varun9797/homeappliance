import { connectDB } from "./config/db.js";
import { UserModel } from "./models/User.js";
import { CategoryModel } from "./models/Category.js";
import { ProductModel } from "./models/Product.js";
import { Role } from "@appliences/shared";

async function seed() {
  await connectDB();

  // Create super admin
  let admin = await UserModel.findOne({ role: Role.SUPER_ADMIN });
  if (!admin) {
    admin = await UserModel.create({
      name: "Super Admin",
      email: "admin@appliences.com",
      password: "admin123",
      role: Role.SUPER_ADMIN,
      isApproved: true,
    });
    console.log("Super admin created: admin@appliences.com / admin123");
  } else {
    console.log("Super admin already exists");
  }

  // Seed default categories
  const categoryData = [
    { name: "Kitchen Chimneys", slug: "kitchen-chimneys", description: "Auto-clean and filterless chimneys" },
    { name: "Hobs", slug: "hobs", description: "Gas hobs and induction cooktops" },
    { name: "Cooktops", slug: "cooktops", description: "Built-in and freestanding cooktops" },
    { name: "Ovens", slug: "ovens", description: "Built-in and countertop ovens" },
    { name: "Dishwashers", slug: "dishwashers", description: "Freestanding and built-in dishwashers" },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    let existing = await CategoryModel.findOne({ slug: cat.slug });
    if (!existing) {
      existing = await CategoryModel.create(cat);
      console.log(`Category created: ${cat.name}`);
    }
    categories[cat.slug] = existing._id.toString();
  }

  // Seed products
  const products = [
    // Kitchen Chimneys
    {
      name: "Elica 60cm Auto-Clean Chimney",
      slug: "elica-60cm-auto-clean-chimney",
      description: "Elica 60cm 1200 m3/hr filterless auto-clean kitchen chimney with motion sensor control. Features a powerful suction capacity and sleek design that complements modern kitchens.",
      price: 12499,
      category: categories["kitchen-chimneys"],
      specifications: { brand: "Elica", model: "WDFL 606 HAC", warranty: "5 years", "Suction Power": "1200 m3/hr", "Size": "60 cm", "Filter Type": "Filterless" },
    },
    {
      name: "Faber 90cm Hood Chimney",
      slug: "faber-90cm-hood-chimney",
      description: "Faber 90cm 1500 m3/hr auto-clean curved glass kitchen chimney with touch and gesture control. Ideal for large kitchens with heavy cooking needs.",
      price: 18999,
      category: categories["kitchen-chimneys"],
      specifications: { brand: "Faber", model: "HOOD ORIENT XPRESS", warranty: "12 years", "Suction Power": "1500 m3/hr", "Size": "90 cm", "Filter Type": "Baffle Filter" },
    },
    {
      name: "Hindware 60cm Chimney Oasis",
      slug: "hindware-60cm-chimney-oasis",
      description: "Hindware Oasis 60cm 1350 m3/hr auto-clean chimney with thermal auto-clean technology. Comes with LED lamps and push button controls.",
      price: 9899,
      category: categories["kitchen-chimneys"],
      specifications: { brand: "Hindware", model: "Oasis 60", warranty: "5 years", "Suction Power": "1350 m3/hr", "Size": "60 cm", "Filter Type": "Filterless" },
    },
    // Hobs
    {
      name: "Bosch 4-Burner Glass Gas Hob",
      slug: "bosch-4-burner-glass-gas-hob",
      description: "Bosch 4-burner toughened glass gas hob with auto-ignition and flame failure safety device. Features cast iron pan supports for stability.",
      price: 16500,
      category: categories["hobs"],
      specifications: { brand: "Bosch", model: "PNH6B6B10I", warranty: "2 years", "Burners": "4", "Material": "Toughened Glass", "Ignition": "Auto" },
    },
    {
      name: "Prestige 3-Burner Gas Hob",
      slug: "prestige-3-burner-gas-hob",
      description: "Prestige Hob Top 3-burner glass top gas stove with powder-coated body. Ergonomic knob design and easy-to-clean surface.",
      price: 7999,
      category: categories["hobs"],
      specifications: { brand: "Prestige", model: "Hobtop PHT 03", warranty: "2 years", "Burners": "3", "Material": "Toughened Glass", "Ignition": "Manual" },
    },
    {
      name: "Kaff 5-Burner Built-in Hob",
      slug: "kaff-5-burner-built-in-hob",
      description: "Kaff 5-burner built-in hob with auto-ignition, heavy duty cast iron pan supports, and flame failure device for maximum safety.",
      price: 22999,
      category: categories["hobs"],
      specifications: { brand: "Kaff", model: "KH 86 BR 51", warranty: "3 years", "Burners": "5", "Material": "Toughened Glass", "Ignition": "Auto" },
    },
    // Cooktops
    {
      name: "Pigeon 2-Burner Stainless Steel Cooktop",
      slug: "pigeon-2-burner-ss-cooktop",
      description: "Pigeon by Stovekraft 2-burner stainless steel gas stove with heavy brass burners. Compact design perfect for small kitchens.",
      price: 1899,
      category: categories["cooktops"],
      specifications: { brand: "Pigeon", model: "Favourite 2B", warranty: "1 year", "Burners": "2", "Material": "Stainless Steel" },
    },
    {
      name: "Philips Induction Cooktop 2200W",
      slug: "philips-induction-cooktop-2200w",
      description: "Philips Viva Collection 2200W induction cooktop with sensor touch and crystal glass plate. Features 10 preset menus for easy cooking.",
      price: 3299,
      category: categories["cooktops"],
      specifications: { brand: "Philips", model: "HD4938/01", warranty: "2 years", "Power": "2200W", "Type": "Induction", "Preset Menus": "10" },
    },
    {
      name: "Bajaj ICX Pearl Induction Cooktop",
      slug: "bajaj-icx-pearl-induction-cooktop",
      description: "Bajaj ICX Pearl 1900W induction cooktop with tact switch and pan sensor technology. Auto-off and voltage protection features.",
      price: 2199,
      category: categories["cooktops"],
      specifications: { brand: "Bajaj", model: "ICX Pearl", warranty: "1 year", "Power": "1900W", "Type": "Induction" },
    },
    // Ovens
    {
      name: "Samsung 28L Convection Microwave Oven",
      slug: "samsung-28l-convection-microwave",
      description: "Samsung 28L convection microwave oven with SlimFry technology and tandoor technology. 200+ pre-programmed recipes and ceramic enamel cavity.",
      price: 14990,
      category: categories["ovens"],
      specifications: { brand: "Samsung", model: "MC28A5033CK", warranty: "1 year", "Capacity": "28L", "Type": "Convection", "Power": "900W" },
    },
    {
      name: "IFB 30L Convection Microwave Oven",
      slug: "ifb-30l-convection-microwave",
      description: "IFB 30L convection microwave oven with 101 standard recipes and multi-stage cooking. Features steam clean for easy maintenance.",
      price: 16490,
      category: categories["ovens"],
      specifications: { brand: "IFB", model: "30BRC2", warranty: "3 years", "Capacity": "30L", "Type": "Convection", "Power": "900W" },
    },
    {
      name: "Morphy Richards 52L OTG Oven",
      slug: "morphy-richards-52l-otg",
      description: "Morphy Richards 52L oven toaster grill with convection fan and motorized rotisserie. Ideal for baking, grilling, and toasting.",
      price: 8999,
      category: categories["ovens"],
      specifications: { brand: "Morphy Richards", model: "52 RCSS", warranty: "2 years", "Capacity": "52L", "Type": "OTG", "Power": "2000W" },
    },
    // Dishwashers
    {
      name: "Bosch 12-Place Freestanding Dishwasher",
      slug: "bosch-12-place-dishwasher",
      description: "Bosch 12-place setting freestanding dishwasher with EcoSilence Drive and AquaStop leak protection. 6 wash programmes for all needs.",
      price: 42990,
      category: categories["dishwashers"],
      specifications: { brand: "Bosch", model: "SMS66GI01I", warranty: "2 years", "Place Settings": "12", "Programmes": "6", "Noise Level": "46 dB" },
    },
    {
      name: "IFB 12-Place Hot Water Wash Dishwasher",
      slug: "ifb-12-place-dishwasher",
      description: "IFB Neptune VX Plus 12-place dishwasher with steam drying and adjustable upper rack. Energy efficient with A++ rating.",
      price: 34990,
      category: categories["dishwashers"],
      specifications: { brand: "IFB", model: "Neptune VX Plus", warranty: "2 years", "Place Settings": "12", "Programmes": "8", "Energy Rating": "A++" },
    },
    {
      name: "Elica 8-Place Countertop Dishwasher",
      slug: "elica-8-place-countertop-dishwasher",
      description: "Elica WQP8-7735HR 8-place countertop dishwasher. Compact design perfect for small families. Features intensive, normal, and eco wash modes.",
      price: 24999,
      category: categories["dishwashers"],
      specifications: { brand: "Elica", model: "WQP8-7735HR", warranty: "2 years", "Place Settings": "8", "Programmes": "5", "Type": "Countertop" },
    },
  ];

  for (const prod of products) {
    const existing = await ProductModel.findOne({ slug: prod.slug });
    if (!existing) {
      await ProductModel.create({ ...prod, createdBy: admin._id });
      console.log(`Product created: ${prod.name}`);
    }
  }

  console.log("Seed complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
