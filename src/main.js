import "./css/index.css";
import IMask from "imask";

// alteração de bandeira
const ccBgColor01 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
);
const ccBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
);
const cclogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type) {
  const colors = {
    visa: ["#436d99", "#2d57f2"],
    mastercard: ["#df6f29", "#c69347"],
    cielo: ["#29BEDF", "#47C6AF"],
    american: ["#16B9FA", "#0077A6"],
    discover: ["#eeaf6c", "#e87900"],
    diners: ["#6EDF29", "#219653"],
    default: ["black", "#gray"],
  };

  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  cclogo.setAttribute("src", `cc-${type}.svg`);
}

//setCardType("mastercard")
globalThis.setCardType = setCardType;

//cvc do cartão securityCode
const securityCode = document.querySelector("#security-code");
const securityCodePattern = { mask: "0000" };
const securityCodeMasked = IMask(securityCode, securityCodePattern);

//observar quando for digitado
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);
});

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value");
  ccSecurity.innerText = code.length === 0 ? "123" : code;
}

//EXPIRAÇÃO do cartão sendo do mês de hoje as validade de 10anos
const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);
//observar quando for digitado
expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value);
});
function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value");
  ccExpiration.innerText = date.length === 0 ? "02/32" : date;
}

//numero do card de acordo com a bandeira (cardNumber)
const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex:
        /^(4011(78|79)|43(1274|8935)|45(1416|7393|763(1|2))|50(4175|6699|67[0-7][0-9]|9000)|50(9[0-9][0-9][0-9])|627780|63(6297|6368)|650(03([^4])|04([0-9])|05(0|1)|05([7-9])|06([0-9])|07([0-9])|08([0-9])|4([0-3][0-9]|8[5-9]|9[0-9])|5([0-9][0-9]|3[0-8])|9([0-6][0-9]|7[0-8])|7([0-2][0-9])|541|700|720|727|901)|65165([2-9])|6516([6-7][0-9])|65500([0-9])|6550([0-5][0-9])|655021|65505([6-7])|6516([8-9][0-9])|65170([0-4]))/,
      cardtype: "cielo",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^3[47][0-9]{5,}$/,
      cardtype: "american",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^6(?:011|5[0-9]{2})[0-9]{3,}$/,
      cardtype: "discover",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(36[0-8][0-9]{3}|369[0-8][0-9]{2}|3699[0-8][0-9]|36999[0-9])/,
      cardtype: "diners",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex);
    });
    return foundMask;
  },
};

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

//observar quando for digitado
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
});

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = number.length === 0 ? "1234 5678  1234 5678" : number;
}

//BOTÃO
const addButton = document.querySelector("#add-card");
addButton.addEventListener("click", () => {
  alert("cartão adicionado");
});
//fica obeservando esse form, mas só faz a ação quando for submit
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
});

//observar quando for digitado aparever no cartão
const CardHolder = document.querySelector("#card-holder");
CardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");
  ccHolder.innerText =
    CardHolder.value.length === 0 ? "FULANO DA SILVA" : CardHolder.value;
});
