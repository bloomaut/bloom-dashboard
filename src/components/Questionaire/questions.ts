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
