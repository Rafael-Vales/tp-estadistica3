
fetch("https://apidemo.geoeducacion.com.ar/api/testing/encuesta/1")
    .then(response => response.json())
    .then(json => {
    const personas = json.data;
    console.log(personas); 

    // Mostrar la tabla de "Población completa"
    const contenedor = document.getElementById("tabla-poblacion");

    // Crear tabla
    let tabla = document.createElement("table");
    tabla.className = "table table-bordered";

    // Crear encabezado
    let encabezado = document.createElement("thead");
    encabezado.innerHTML = `
        <tr>
        <th>Nombre y Apellido</th>
        <th>Edad</th>
        <th>Curso</th>
        <th>Nivel Educativo</th>
        </tr>
    `;
    tabla.appendChild(encabezado);

    // Crear cuerpo de tabla
    let cuerpo = document.createElement("tbody");

    personas.forEach(p => {
        let fila = document.createElement("tr");

        let nombreApellido = `${p.nombre} ${p.apellido}`;
        fila.innerHTML = `
        <td>${nombreApellido}</td>
        <td>${p.Edad}</td>
        <td>${p.curso}</td>
        <td>${p.nivel}</td>
        `;

        cuerpo.appendChild(fila);
    });

    tabla.appendChild(cuerpo);
    contenedor.appendChild(tabla);

    
    generarTablaFrecuencia(personas);
    })
    .catch(error => console.error("Error al conectar con la API:", error));



function generarTablaFrecuencia(personas) {
    console.log("Vamos a calcular frecuencia de niveles...");


  const contenedor = document.getElementById("tablas-frecuencia");

  
  let frecuencias = {};
  personas.forEach(p => {
    let nivel = p.nivel;
    if (frecuencias[nivel]) {
      frecuencias[nivel]++;
    } else {
      frecuencias[nivel] = 1;
    }
  });

  const total = personas.length;
  let acumulado = 0;

  // Crear tabla
  let tabla = document.createElement("table");
  tabla.className = "table table-bordered";

  let encabezado = document.createElement("thead");
  encabezado.innerHTML = `
    <tr>
      <th>Nivel Educativo</th>
      <th>Frecuencia Absoluta (FA)</th>
      <th>Frecuencia Acumulada (FAc)</th>
      <th>Frecuencia Relativa (FR)</th>
    </tr>
  `;
  tabla.appendChild(encabezado);

  let cuerpo = document.createElement("tbody");

  for (let nivel in frecuencias) {
    let fa = frecuencias[nivel];
    acumulado += fa;
    let fr = (fa / total).toFixed(2); 

    let fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${nivel}</td>
      <td>${fa}</td>
      <td>${acumulado}</td>
      <td>${fr}</td>
    `;

    cuerpo.appendChild(fila);
  }

  tabla.appendChild(cuerpo);
  contenedor.appendChild(tabla);
  let frecuenciasCurso = {};
  personas.forEach(p => {
    let curso = p.curso;
    if (frecuenciasCurso[curso]) {
      frecuenciasCurso[curso]++;
    } else {
      frecuenciasCurso[curso] = 1;
    }
  });

  const totalCursos = personas.length;
  let acumuladoCurso = 0;

  let tablaCurso = document.createElement("table");
  tablaCurso.className = "table table-bordered mt-5";

  let encabezadoCurso = document.createElement("thead");
  encabezadoCurso.innerHTML = `
    <tr>
      <th>Curso</th>
      <th>Frecuencia Absoluta (FA)</th>
      <th>Frecuencia Acumulada (FAc)</th>
      <th>Frecuencia Relativa (FR)</th>
    </tr>
  `;
  tablaCurso.appendChild(encabezadoCurso);

  let cuerpoCurso = document.createElement("tbody");

  for (let curso in frecuenciasCurso) {
    let fa = frecuenciasCurso[curso];
    acumuladoCurso += fa;
    let fr = (fa / totalCursos).toFixed(2);

    let fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${curso}</td>
      <td>${fa}</td>
      <td>${acumuladoCurso}</td>
      <td>${fr}</td>
    `;
    cuerpoCurso.appendChild(fila);
    generarTablaEstadisticos(personas);

    function generarTablaEstadisticos(personas) {
  const contenedor = document.getElementById("tabla-estadisticos");

  // Obtener edades y ordenarlas
  let edades = personas.map(p => p.Edad).sort((a, b) => a - b);

  const total = edades.length;

  // Media
  let suma = edades.reduce((acc, val) => acc + val, 0);
  let media = (suma / total).toFixed(2);

  // Mediana
  let mediana = total % 2 === 0 ?
    ((edades[total / 2 - 1] + edades[total / 2]) / 2).toFixed(2) :
    edades[Math.floor(total / 2)];

  // Mínimo y Máximo
  let minimo = Math.min(...edades);
  let maximo = Math.max(...edades);

  // Cuartiles
  let Q1 = edades[Math.floor(total * 0.25)];
  let Q2 = mediana; // igual a la mediana

  // Desvío estándar
  let varianza = edades.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / total;
  let desvioEstandar = Math.sqrt(varianza).toFixed(2);

  // Crear tabla
  let tabla = document.createElement("table");
  tabla.className = "table table-bordered";

  tabla.innerHTML = `
    <thead>
      <tr><th>Estadístico</th><th>Valor</th></tr>
    </thead>
    <tbody>
      <tr><td>Media</td><td>${media}</td></tr>
      <tr><td>Mediana</td><td>${mediana}</td></tr>
      <tr><td>Valor Mínimo</td><td>${minimo}</td></tr>
      <tr><td>Valor Máximo</td><td>${maximo}</td></tr>
      <tr><td>Primer Cuartil (Q1)</td><td>${Q1}</td></tr>
      <tr><td>Segundo Cuartil (Q2)</td><td>${Q2}</td></tr>
      <tr><td>Desvío Estándar</td><td>${desvioEstandar}</td></tr>
    </tbody>
  `;

  contenedor.appendChild(tabla);
}
  }

  tablaCurso.appendChild(cuerpoCurso);
  contenedor.appendChild(tablaCurso);
}

