import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbFilename = "dev.db";
const absPath = path.resolve(process.cwd(), dbFilename);
const resolvedUrl = "file:" + absPath.replace(/\\/g, "/");

const adapter = new PrismaBetterSqlite3({ url: resolvedUrl } as any);
const prisma = new PrismaClient({ adapter });

async function updateImages() {
  const imagesMap: Record<string, string> = {
    "Madhubani Painting - Tree of Life": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800",
    "Bhagalpuri Silk Saree": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    "Silao Khaja (1 kg)": "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800",
    "Sikki Grass Basket": "https://images.unsplash.com/photo-1518388484196-41fb8e99bc68?auto=format&fit=crop&q=80&w=800",
    "Bihar Spice Box (Set of 6)": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800",
    "Wooden Carved Elephant": "https://images.unsplash.com/photo-1582560469772-246e7f4bd169?auto=format&fit=crop&q=80&w=800",
    "Litti Chokha Ready Mix": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=800",
    "Tilkut - Gaya Special (500g)": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800",
    "Mithila Makhana (1 kg)": "https://images.unsplash.com/photo-1585863264627-f70557404453?auto=format&fit=crop&q=80&w=800",
    "Madhubani Wall Hanging": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
    "Katarni Rice (5 kg)": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
    "Bluetooth Speaker": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800",
  };

  const products = await prisma.product.findMany();
  for (const product of products) {
    if (imagesMap[product.name]) {
      const mainImage = imagesMap[product.name];
      const imagesArr = JSON.stringify([mainImage]);
      await prisma.product.update({
        where: { id: product.id },
        data: { image: mainImage, images: imagesArr }
      });
      console.log(`Updated ${product.name}`);
    }
  }
  console.log("Done updating images.");
}

updateImages().catch(console.error).finally(() => prisma.$disconnect());
