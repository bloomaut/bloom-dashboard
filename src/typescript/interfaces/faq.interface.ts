export interface FAQ {
  _id: string;
  tempKey: string; // Auxiliar para crear nuevos FAQs vacios y agregarlos al useState
  question: string;
  answer: string;
}

export interface PostFAQ {
  question: string;
  answer: string;
}
