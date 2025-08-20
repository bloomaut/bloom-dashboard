export const questions = [
  "¿Cual es tu nombre completo?",
  "¿Cual es tu edad?",
  "¿En que pais y ciudad estas actualmente?",
  "¿A que te dedicas actualmente?",
  "¿Que tan involucrado estas hoy en tu idea o negocio?", // Solo pienso en ello (1) / Estoy dando pasos (2) / Ya vendí algo - lancé (3)
  "¿Cuanto tiempo por semana podrias dedicarle a tu negocio?", // 0-2 horas (1) / 2-5 horas (2) / 5-10 horas (3) / Más de 10 horas (4)
  "¿Que tan activo sos hoy en tus redes sociales personales?", // Muy activo/a (4) / Moderado/a (3) / Casi nada (2) / No uso redes (1)
  "¿Estas dispuestoa a aparecer en redes sociales mostrando tu imagen rostro manos o cuerpo para representar tu marca?", // Si o No
  "¿Hay algun tipo de contenido con el que no te sientas comodoa creando o apareciendo?", // Ej temas politicos mostrar familia ciertos valores etc
  "¿Hay algun tipo de contenido con el que te sientas comodoa creando o apareciendo?",
  "¿Estarias dispuestoa a utilizar tu nombre real como parte de tu nombre de marca?", // Si, estoy dispuesto / No, prefiero no utilizar mi nobre real
  "¿Hay algo que no te preguntamos y que te parece importante que sepamos sobre vos?",

  "¿Tu idea o negocio esta mas enfocado en ofrecer un producto o un servicio?", // product / service / product_service

  "¿Que productos vendes o pensas vender?", // 2-3 lineas maximo Nombre Descripcion Precio Moneda
  "¿Como entregas o entregarias el producto?", // shipping_only | pickup_only | shipping_and_pickup
  "¿Cual es el alcance de tu servicio de envio?", // local | national | international | not_applicable
  "¿Que tipo de stock podrias manejar al principio?", // Ej 10 unidades bajo demanda por pedido etc
  "¿Fabricas vos el producto lo tercerizas o lo revendes?", // in_house | outsourced | resale
  "¿Hay algo que no te preguntamos y que te parece importante que sepamos sobre tus productos?",

  "¿Que servicio ofreces o pensas ofrecer?", // 2-3 lineas maximo Nombre Descripcion Precio Moneda
  "¿Cual es la modalidad del servicion que ofreces?", // in_person | virtual | mixed
  "¿Como se agenda o contrataria el servicio actualmente si aplica?",
  "¿Hay algo que no te preguntamos y que te parece importante que sepamos sobre tus servicios?",

  "¿Tu idea o negocio ya tiene un nombre pensado o definido?", // No business name defined | Nombre del negocio
  "¿En que pais y ciudad esta operando tu negocio o piensas hacerlo?",
  "¿Contas con alguien que pueda ayudarte en tu negocio?",
  "¿Que marcas cuentas o referentes te inspiran o te gustan?", // Hasta 3 ejemplos
  "¿Con que frase palabra o emocion te gustaria que las personas asocien tu marca?",
  "¿Que personas imaginas como tu cliente ideal?", // Edad genero estilo de vida intereses habitos de consumo etc
  "¿Por que pensas que esa persona compraria tu producto o servicio?",
  "¿Cual seria un objetivo realista para tu negocio en los proximos 3 meses?",
  "¿Hay algo que no te preguntamos y que te parece importante que sepamos sobre tu negocio o idea?",
];

export const questions2 = [
  {
    id: "Q1",
    type: "simple_text",
    question: "What is your full name?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q2",
    type: "simple_text",
    question: "How old are you?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q3",
    type: "simple_text",
    question: "Which country and city are you currently in?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q4",
    type: "simple_text",
    question: "What do you currently do for work?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q5",
    type: "singlechoice",
    question: "How involved are you today in your idea or business?",
    short_description: "",
    options: [
      { option: "I only think about it", value: "1" },
      { option: "I am taking steps", value: "2" },
      { option: "I have sold something - launched", value: "3" },
    ],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q6",
    type: "singlechoice",
    question: "How many hours per week could you dedicate to your business?",
    short_description: "",
    options: [
      { option: "0-2 hours", value: "1" },
      { option: "2-5 hours", value: "2" },
      { option: "5-10 hours", value: "3" },
      { option: "More than 10 hours", value: "4" },
    ],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q7",
    type: "singlechoice",
    question: "How active are you on your personal social media today?",
    short_description: "",
    options: [
      { option: "Very active", value: "1" },
      { option: "Moderate", value: "2" },
      { option: "Almost none", value: "3" },
      { option: "I don’t use social media", value: "4" },
    ],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q8",
    type: "singlechoice",
    question: "Are you willing to appear on social media showing your face, hands, or body to represent your brand?",
    short_description: "",
    options: [
      { option: "Yes", value: "Yes" },
      { option: "No", value: "No" },
    ],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q9",
    type: "extended_text",
    question: "Is there any type of content you would feel uncomfortable creating or appearing in?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q10",
    type: "extended_text",
    question: "Is there any type of content you would feel comfortable creating or appearing in?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q11",
    type: "singlechoice",
    question: "Would you be willing to use your real name as part of your brand name?",
    short_description: "",
    options: [
      { option: "Yes, I am willing", value: "Yes, I am willing" },
      { option: "No, I prefer not to use my real name", value: "No, I prefer not to use my real name" },
    ],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q12",
    type: "extended_text",
    question: "Is there anything we didn’t ask that you think is important for us to know about you?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q13",
    type: "singlechoice",
    question: "Is your idea or business more focused on offering a product or a service?",
    short_description: "",
    options: [
      { option: "Product", value: "product" },
      { option: "Service", value: "service" },
      { option: "Both", value: "product_service" },
    ],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q14",
    type: "extended_text",
    question: "What products do you sell or plan to sell?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q15",
    type: "singlechoice",
    question: "How do you deliver or plan to deliver the product?",
    short_description: "",
    options: [
      { option: "Shipping only", value: "shipping_only" },
      { option: "Pickup only", value: "pickup_only" },
      { option: "Shipping and Pickup", value: "shipping_and_pickup" },
    ],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q16",
    type: "singlechoice",
    question: "What is the scope of your shipping service?",
    short_description: "",
    options: [
      { option: "Local", value: "local" },
      { option: "National", value: "national" },
      { option: "International", value: "international" },
      { option: "Not Applicable", value: "not_applicable" },
    ],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q17",
    type: "extended_text",
    question: "What type of stock could you manage at the beginning?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q18",
    type: "singlechoice",
    question: "Do you manufacture the product, outsource it, or resell it?",
    short_description: "",
    options: [
      { option: "I manufacture it", value: "in_house" },
      { option: "I outsource it", value: "outsourced" },
      { option: "I resell it", value: "resale" },
    ],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q19",
    type: "extended_text",
    question: "Is there anything we didn’t ask that you think is important for us to know about your products?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q20",
    type: "extended_text",
    question: "What service do you offer or plan to offer?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q21",
    type: "singlechoice",
    question: "What is the format of the service you offer?",
    short_description: "",
    options: [
      { option: "In-person", value: "in_person" },
      { option: "Virtual", value: "virtual" },
      { option: "Mixed", value: "mixed" },
    ],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q22",
    type: "extended_text",
    question: "How is the service scheduled or contracted currently, if applicable?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q23",
    type: "extended_text",
    question: "Is there anything we didn’t ask that you think is important for us to know about your services?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q24",
    type: "simple_text",
    question: "What is the name of your idea or business?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: true,
    conditionalQuestion: "Does your idea or business already have a planned or defined name?",
    defaultAnswer: "No business name defined",
  },
  {
    id: "Q25",
    type: "simple_text",
    question: "Which country and city is your business operating in or planning to operate in?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q26",
    type: "extended_text",
    question: "Do you have someone who can help you in your business?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q27",
    type: "extended_text",
    question: "Which brands or role models inspire or appeal to you?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q28",
    type: "extended_text",
    question: "Which phrase, word, or emotion would you like people to associate with your brand?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q29",
    type: "extended_text",
    question: "Who do you imagine as your ideal client?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q30",
    type: "extended_text",
    question: "Why do you think that person would buy your product or service?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q31",
    type: "extended_text",
    question: "What would be a realistic goal for your business in the next 3 months?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
  {
    id: "Q32",
    type: "extended_text",
    question: "Is there anything we didn’t ask that you think is important for us to know about your business or idea?",
    short_description: "",
    options: [""],
    hasConditionalQuestion: false,
    conditionalQuestion: "",
    defaultAnswer: "",
  },
];

export const generatePropPayload = (questData: { userId: string; answers: string[] }) => {
  return {
    blocks: [
      {
        block: "P0_businessIdentity",
        clientId: questData.userId,
        questions: [
          {
            id: "P0_Q1",
            answer: questData.answers[0],
          },
          {
            id: "P0_Q2",
            answer: questData.answers[1],
          },
          {
            id: "P0_Q3",
            answer: questData.answers[2],
          },
          {
            id: "P0_Q4",
            answer: questData.answers[3],
          },
          {
            id: "P0_Q5",
            answer: questData.answers[4],
          },
          {
            id: "P0_Q6",
            answer: questData.answers[5],
          },
          {
            id: "P0_Q7",
            answer: questData.answers[6],
          },
          {
            id: "P0_Q8",
            answer: questData.answers[7],
          },
          {
            id: "P0_Q9",
            answer: questData.answers[8],
          },
          {
            id: "P0_Q10",
            answer: questData.answers[9],
          },
          {
            id: "P0_Q11",
            answer: questData.answers[10],
          },
          {
            id: "P0_Q12",
            answer: questData.answers[11],
          },
        ],
      },
      {
        block: "P0_offer",
        clientId: questData.userId,
        questions: [
          {
            id: "P0_Q13",
            answer: questData.answers[12],
          },
        ],
      },
      {
        block: "P0_product",
        clientId: questData.userId,
        questions: [
          {
            id: "P0_Q14",
            answer: questData.answers[13],
          },
          {
            id: "P0_Q15",
            answer: questData.answers[14],
          },
          {
            id: "P0_Q16",
            answer: questData.answers[15],
          },
          {
            id: "P0_Q17",
            answer: questData.answers[16],
          },
          {
            id: "P0_Q18",
            answer: questData.answers[17],
          },
          {
            id: "P0_Q19",
            answer: questData.answers[18],
          },
        ],
      },
      {
        block: "P0_service",
        clientId: questData.userId,
        questions: [
          {
            id: "P0_Q20",
            answer: questData.answers[19],
          },
          {
            id: "P0_Q21",
            answer: questData.answers[20],
          },
          {
            id: "P0_Q22",
            answer: questData.answers[21],
          },
          {
            id: "P0_Q23",
            answer: questData.answers[22],
          },
        ],
      },
      {
        block: "P0_businessProfile",
        clientId: questData.userId,
        questions: [
          {
            id: "P0_Q24",
            answer: questData.answers[23],
          },
          {
            id: "P0_Q25",
            answer: questData.answers[24],
          },
          {
            id: "P0_Q26",
            answer: questData.answers[25],
          },
          {
            id: "P0_Q27",
            answer: questData.answers[26],
          },
          {
            id: "P0_Q28",
            answer: questData.answers[27],
          },
          {
            id: "P0_Q29",
            answer: questData.answers[28],
          },
          {
            id: "P0_Q30",
            answer: questData.answers[29],
          },
          {
            id: "P0_Q31",
            answer: questData.answers[30],
          },
          {
            id: "P0_Q32",
            answer: questData.answers[31],
          },
        ],
      },
    ],
  };
};

export const generatePayload = (questData: {
  userId: string;
  answers: string[];
  terms: boolean;
  completed: boolean;
  prop: boolean;
}) => {
  return [
    {
      completed: questData.completed || false,
      terms: questData.terms || false,
      block: "P0_businessIdentity",
      clientId: questData.userId,

      prop: questData.prop,
      questions: [
        {
          id: "P0_Q1",
          answer: questData.answers[0],
        },
        {
          id: "P0_Q2",
          answer: questData.answers[1],
        },
        {
          id: "P0_Q3",
          answer: questData.answers[2],
        },
        {
          id: "P0_Q4",
          answer: questData.answers[3],
        },
        {
          id: "P0_Q5",
          answer: questData.answers[4],
        },
        {
          id: "P0_Q6",
          answer: questData.answers[5],
        },
        {
          id: "P0_Q7",
          answer: questData.answers[6],
        },
        {
          id: "P0_Q8",
          answer: questData.answers[7],
        },
        {
          id: "P0_Q9",
          answer: questData.answers[8],
        },
        {
          id: "P0_Q10",
          answer: questData.answers[9],
        },
        {
          id: "P0_Q11",
          answer: questData.answers[10],
        },
        {
          id: "P0_Q12",
          answer: questData.answers[11],
        },
      ],
    },
    {
      completed: questData.completed || false,
      terms: questData.terms || false,
      block: "P0_offer",
      clientId: questData.userId,

      prop: questData.prop,
      questions: [
        {
          id: "P0_Q13",
          answer: questData.answers[12],
        },
      ],
    },
    {
      completed: questData.completed || false,
      terms: questData.terms || false,
      block: "P0_product",
      clientId: questData.userId,

      prop: questData.prop,
      questions: [
        {
          id: "P0_Q14",
          answer: questData.answers[13],
        },
        {
          id: "P0_Q15",
          answer: questData.answers[14],
        },
        {
          id: "P0_Q16",
          answer: questData.answers[15],
        },
        {
          id: "P0_Q17",
          answer: questData.answers[16],
        },
        {
          id: "P0_Q18",
          answer: questData.answers[17],
        },
        {
          id: "P0_Q19",
          answer: questData.answers[18],
        },
      ],
    },
    {
      completed: questData.completed || false,
      terms: questData.terms || false,
      block: "P0_service",
      clientId: questData.userId,

      prop: questData.prop,
      questions: [
        {
          id: "P0_Q20",
          answer: questData.answers[19],
        },
        {
          id: "P0_Q21",
          answer: questData.answers[20],
        },
        {
          id: "P0_Q22",
          answer: questData.answers[21],
        },
        {
          id: "P0_Q23",
          answer: questData.answers[22],
        },
      ],
    },
    {
      completed: questData.completed || false,
      terms: questData.terms || false,
      block: "P0_businessProfile",
      clientId: questData.userId,

      prop: questData.prop,
      questions: [
        {
          id: "P0_Q24",
          answer: questData.answers[23],
        },
        {
          id: "P0_Q25",
          answer: questData.answers[24],
        },
        {
          id: "P0_Q26",
          answer: questData.answers[25],
        },
        {
          id: "P0_Q27",
          answer: questData.answers[26],
        },
        {
          id: "P0_Q28",
          answer: questData.answers[27],
        },
        {
          id: "P0_Q29",
          answer: questData.answers[28],
        },
        {
          id: "P0_Q30",
          answer: questData.answers[29],
        },
        {
          id: "P0_Q31",
          answer: questData.answers[30],
        },
        {
          id: "P0_Q32",
          answer: questData.answers[31],
        },
      ],
    },
  ];
};

export const answers = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];
