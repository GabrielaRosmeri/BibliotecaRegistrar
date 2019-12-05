const restList = document.querySelector("#content__list");
const form = document.querySelector("#content__add");
const dialog = document.querySelector("#dialog");
const ejemList = document.querySelector("#list")
var libros = [
  [
    "0001",
    "001",
    "030.001",
    "1",
    "ENCICLOPEDIA DE LA AUDITORIA",
    "GRUPO OCEANO",
    "2004",
    "P102"
  ],
  [
    "0002",
    "001",
    "030.002",
    "1",
    "ENCICLOPEDIA PRACTICA DE LA PEQUEÑA Y MEDIANA EMPRESA “PYME”",
    "GRUPO OCEANO",
    "2004",
    "P97"
  ],
  [
    "0003",
    "001",
    "030.003",
    "1",
    "ENCICLOPEDIA DEL MANAGEMENT",
    "GRUPO OCEANO",
    "2004",
    "P97"
  ],
  [
    "0004",
    "001",
    "030.004",
    "1",
    "ENCICLOPEDIA DE MARKETING Y VENTAS",
    "GRUPO OCEANO",
    "2004",
    "P97"
  ],
  [
    "0005",
    "001",
    "030.005",
    "1",
    "ENCICLOPEDIA DE LA PSICOPEDAGOGIA: PEDAGOGIA Y PSICOLOGIA",
    "GRUPO OCEANO",
    "2005",
    "P73"
  ],
  [
    "0006",
    "001",
    "040.001.1",
    "1",
    "GRAN DICCIONARIO ENCICLOPEDICO VISUAL - TOMO 1",
    "GRUPO OCEANO",
    "2003",
    "P72"
  ],
  [
    "0007",
    "001",
    "040.001.2",
    "1",
    "GRAN DICCIONARIO ENCICLOPEDICO VISUAL - TOMO 2",
    "GRUPO OCEANO",
    "2003",
    "P72"
  ],
  [
    "0008",
    "001",
    "040.001.3",
    "1",
    "GRAN DICCIONARIO ENCICLOPEDICO VISUAL - TOMO 3",
    "GRUPO OCEANO",
    "2003",
    "P72"
  ],
  [
    "0009",
    "001",
    "040.001.4",
    "1",
    "GRAN DICCIONARIO ENCICLOPEDICO VISUAL - TOMO 4",
    "GRUPO OCEANO",
    "2003",
    "P72"
  ],
  [
    "0010",
    "001",
    "040.001.5",
    "1",
    "GRAN DICCIONARIO ENCICLOPEDICO VISUAL - TOMO 5",
    "GRUPO OCEANO",
    "2003",
    "P72"
  ]
];

function cargarDatos() {
  for (let index = 0; index < libros.length; index++) {
    const element = libros[index];
    db.collection("libros")
      .add({
        numero: parseInt(element[0]),
        codigoLocal: element[1],
        dewey: element[2],
        cantidad: parseInt(element[3]),
        titulo: element[4],
        autores: element[5],
        anioPublicacion: element[6],
        programaEstudio: element[7],
        prestados: 0
      })
      .then(doc => {
        db.collection("libros")
          .doc(doc.id)
          .collection("ejemplares")
          .add({
            rfid: "C" + index,
            estado: true,
            titulo: element[4],
            idLibro: doc.id
          })
          .then(doc2 => {
            db.collection("libros")
              .doc(doc.id)
              .collection("ejemplares")
              .doc(doc2.id)
              .update({
                id: doc2.id
              });
          })
          .then(() => {
            console.log("Agregado");
          });
      })
      .catch(error => {
        console.log("Errooooor" + error);
      });
  }
}
// crear elementos y renderizar libros
function renderRest(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let edit = document.createElement("button");
  let div = document.createElement("div");

  li.setAttribute("class", "content_item");
  li.setAttribute("data_id", doc.id);

  edit.setAttribute("class", "icofont-ui-edit")
  div.setAttribute("class", "item__info")

  name.textContent = doc.data().titulo;
  city.textContent = doc.data().cantidad;

  city.setAttribute("class", "item__span");

  div.appendChild(name);
  div.appendChild(city);

  li.appendChild(div);
  li.appendChild(edit);
  edit.addEventListener("click", function () {
    dialog.showModal()
    ejemList.innerHTML = ""
    db.collection("libros").doc(doc.id).collection("ejemplares")
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          console.log(doc)
          renderEjemplar(doc);
        });
      });
  })

  restList.appendChild(li);

  // Borrando datos
  // cross.addEventListener('click', (e) =>{
  //     let id = e.target.parentElement.getAttribute('data_id');
  //     db.collection('restaurant').doc(id).delete();
  // } )
}

db.collection("libros")
  .get()
  .then(snapshot => {
    snapshot.docs.forEach(doc => {
      renderRest(doc);
    });
  });

// Guardando datos
form.addEventListener("submit", e => {
  e.preventDefault();

  db.collection("restaurant").add({
    titulo: form.titulo.value,
    autores: form.autores.value,
    cantidad: form.cantidad.value
  });

  form.titulo.value = "";
  form.autores.value = "";
  form.cantidad.value = "";
});

function renderEjemplar(doc) {
  let li = document.createElement("li");
  let name = document.createElement("input");
  let city = document.createElement("span");
  let edit = document.createElement("button");
  let div = document.createElement("div");

  li.setAttribute("class", "content_item");
  li.setAttribute("data_id", doc.id);

  edit.setAttribute("class", "icofont-verification-check")
  div.setAttribute("class", "item__info")

  city.textContent = doc.data().estado;
  name.setAttribute("placeholder", doc.data().rfid)
  city.setAttribute("class", "item__span");

  div.appendChild(name);
  div.appendChild(city);

  li.appendChild(div);
  li.appendChild(edit);
  edit.addEventListener("click", function () {

  })

  ejemList.appendChild(li);

  // Borrando datos
  // cross.addEventListener('click', (e) =>{
  //     let id = e.target.parentElement.getAttribute('data_id');
  //     db.collection('restaurant').doc(id).delete();
  // } )
}

function closeDialog() {
  dialog.close()
}