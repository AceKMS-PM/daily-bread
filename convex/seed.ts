import { mutation } from "./_generated/server";
import { v } from "convex/values";

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

const SEED_DEVOTIONALS = [
  {
    title: "La Lampe sur mon Sentier",
    content: `Il est des moments où le chemin devant nous semble obscur. Les décisions à prendre, les directions à choisir, les épreuves à traverser — tout concourt à nous plonger dans une forme de nuit intérieure. C'est précisément dans ces ténèbres que la Parole de Dieu devient cette lampe fidèle que le psalmiste célèbre avec tant de certitude.

« Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. » (Psaume 119:105)

Ce verset n'est pas une simple métaphore poétique. Il est le témoignage d'une vie vécue dans la dépendance de la révélation divine. La lampe ne révèle pas tout l'horizon d'un seul coup — elle éclaire le pas présent. Un pas après l'autre, la Parole nous guide avec une patience infinie.

Dans un monde saturé d'informations contradictoires, la voix de l'Écriture reste la boussole qui ne ment pas. Elle ne promet pas une carte complète du voyage, mais elle garantit la lumière suffisante pour chaque étape.

Dieu ne nous a pas donné Sa Parole pour satisfaire notre curiosité, mais pour guider notre obéissance. Chaque verset est une lampe allumée dans la pièce sombre de notre incertitude. Ouvrir les Écritures, c'est inviter la lumière là où règnent les ombres.`,
    scheduledFor: daysFromNow(0),
    bibleBook: "Psaumes",
    bibleChapter: 119,
    bibleVerseStart: 105,
    bibleText: "Ta parole est une lampe à mes pieds, et une lumière sur mon sentier.",
    bibleTranslation: "LSG",
    prayer: "Seigneur, merci pour Ta Parole qui éclaire mon chemin. Dans les moments d'obscurité et de doute, rappelle-moi que Ta lumière est suffisante pour chaque pas que je dois faire aujourd'hui. Donne-moi la foi de marcher non pas par la vue, mais par la confiance en Tes promesses. Amen.",
    reflection: "Dans quel domaine de ta vie as-tu le plus besoin que la Parole de Dieu soit une lampe aujourd'hui ?",
    tags: ["parole", "lumière", "foi", "direction"],
    status: "published",
  },
  {
    title: "L'Obéissance qui Bénit",
    content: `L'obéissance est un mot qui dérange notre époque. Il évoque la contrainte, la soumission, la perte d'autonomie. Pourtant, dans l'Écriture, l'obéissance à Dieu n'est jamais présentée comme une privation, mais comme la voie de la bénédiction véritable.

« Si vous m'aimez, gardez mes commandements. » (Jean 14:15)

Jésus établit ici un lien indissoluble entre l'amour et l'obéissance. Obéir n'est pas d'abord une question de règle, mais de relation. Nous n'obéissons pas pour être aimés, mais parce que nous sommes aimés.

Le paradoxe de la vie chrétienne est que la liberté véritable ne se trouve pas dans l'absence de contraintes, mais dans l'alignement avec la volonté de Celui qui nous a créés. Comme un fleuve coule librement dans son lit, notre vie trouve son plein épanouissement lorsque nous demeurons dans les limites que Dieu a tracées par amour.

L'obéissance n'est pas la voie facile — elle est souvent un combat contre notre orgueil et notre désir d'autonomie. Mais c'est précisément dans ce combat que nous découvrons que les commandements de Dieu ne sont pas un fardeau, mais une sécurité.

Chaque acte d'obéissance est une déclaration de confiance. Nous disons à Dieu : « Je crois que Ta voie est meilleure que la mienne. » Et dans cette confiance, nous trouvons la paix qui surpasse toute intelligence.`,
    scheduledFor: daysFromNow(-1),
    bibleBook: "Jean",
    bibleChapter: 14,
    bibleVerseStart: 15,
    bibleText: "Si vous m'aimez, gardez mes commandements.",
    bibleTranslation: "LSG",
    prayer: "Père, pardonne-moi pour les fois où j'ai préféré ma volonté à la Tienne. Apprends-moi à voir Ton commandement non comme une restriction, mais comme l'expression de Ton amour. Donne-moi un cœur qui trouve sa joie dans l'obéissance à Ta Parole. Au nom de Jésus, Amen.",
    reflection: "Y a-t-il un domaine dans ta vie où tu résistes à l'obéissance à Dieu ? Qu'est-ce que cette résistance révèle sur ta confiance en Lui ?",
    tags: ["amour", "obéissance", "foi", "confiance"],
    status: "published",
  },
  {
    title: "Veillez et Priez",
    content: `La vie spirituelle est une veille. Dans l'Évangile de Matthieu, Jésus adresse à Ses disciples un appel qui résonne encore avec une urgence particulière :

« Veillez et priez, afin que vous ne tombiez pas dans la tentation. L'esprit est bien disposé, mais la chair est faible. » (Matthieu 26:41)

Ces paroles ont été prononcées à Gethsémané, dans l'ombre de la croix imminente. Les disciples, malgré leur amour sincère pour le Maître, ont succombé au sommeil. Leur esprit voulait veiller, mais leur corps a cédé.

Cette scène nous parle de la fragilité de notre condition humaine. Nous voulons suivre Dieu pleinement, mais nous sommes fatigués, distraits, accaparés par les soucis de ce monde. Veiller est un acte de volonté — un choix délibéré de rester attentif à la présence de Dieu dans le tumulte du quotidien.

La prière n'est pas un simple rituel religieux. Elle est le moyen par lequel notre esprit faible se connecte à la force infinie de Dieu. Veiller sans prier, c'est compter sur nos propres forces. Prier sans veiller, c'est oublier que l'ennemi rôde comme un lion rugissant.

La vigilance chrétienne n'est pas une anxiété permanente, mais une attention aimante. C'est vivre chaque instant conscient que Dieu est à l'œuvre, que le combat spirituel est réel, et que la victoire appartient à Celui qui est déjà ressuscité.`,
    scheduledFor: daysFromNow(-2),
    bibleBook: "Matthieu",
    bibleChapter: 26,
    bibleVerseStart: 41,
    bibleText: "Veillez et priez, afin que vous ne tombiez pas dans la tentation. L'esprit est bien disposé, mais la chair est faible.",
    bibleTranslation: "LSG",
    prayer: "Seigneur, pardonne-moi pour les moments où j'ai laissé ma vigilance spirituelle s'assoupir. Réveille en moi la flamme de la prière et la conscience de Ta présence. Apprends-moi à veiller non pas dans l'inquiétude, mais dans une confiance active qui cherche Ton visage en toute circonstance. Amen.",
    reflection: "Qu'est-ce qui, dans ta vie actuelle, menace d'assoupir ta vigilance spirituelle ? Comment pourrais-tu renforcer ton temps de prière cette semaine ?",
    tags: ["prière", "vigilance", "tentation", "force"],
    status: "published",
  },
];



export const seedDevotionals = mutation({
  args: {
    confirm: v.optional(v.boolean()),
  },
  handler: async (ctx) => {
    const existing = await ctx.db.query("devotionals").first();
    if (existing) {
      throw new Error(
        "Des dévotions existent déjà. Passe confirm: true pour forcer l'ajout quand même."
      );
    }

    const admin = await ctx.db.query("users").first();
    if (!admin) {
      throw new Error("Aucun utilisateur trouvé. Crée d'abord un compte admin.");
    }

    const results: string[] = [];
    for (const dev of SEED_DEVOTIONALS) {
      const id = await ctx.db.insert("devotionals", {
        title: dev.title,
        content: dev.content,
        scheduledFor: dev.scheduledFor,
        bibleBook: dev.bibleBook,
        bibleChapter: dev.bibleChapter,
        bibleVerseStart: dev.bibleVerseStart,
        bibleText: dev.bibleText,
        bibleTranslation: dev.bibleTranslation,
        prayer: dev.prayer,
        reflection: dev.reflection,
        tags: [...dev.tags],
        status: dev.status as "draft" | "published" | "scheduled",
        authorId: admin._id,
        publishedAt: Date.now() - (daysFromNow(0) === dev.scheduledFor ? 0 : 86400000),
        viewCount: 0,
        likeCount: 0,
      });
      results.push(`${dev.title} → ${id}`);
    }

    return {
      message: "3 dévotions par défaut ajoutées.",
      devotionals: results,
    };
  },
});
