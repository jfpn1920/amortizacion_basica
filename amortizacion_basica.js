/*------------------------------*/
/*--|elementos_del_documento|--*/
/*------------------------------*/

const monto_prestamo = document.getElementById("monto_prestamo");
const tasa_interes = document.getElementById("tasa_interes");
const numero_cuotas = document.getElementById("numero_cuotas");

const boton_calcular = document.getElementById("boton_calcular");
const boton_limpiar = document.getElementById("boton_limpiar");

const cuota_mensual = document.getElementById("cuota_mensual");
const total_intereses = document.getElementById("total_intereses");
const total_pagado = document.getElementById("total_pagado");

const cuerpo_tabla = document.getElementById("cuerpo_tabla");

/*------------------------------*/
/*--|cargar_datos_guardados|--*/
/*------------------------------*/

const datos_guardados =
    localStorage.getItem("datos_amortizacion");

if (datos_guardados) {
    cargar_datos();
}

/*------------------------------*/
/*--|cargar_datos|--*/
/*------------------------------*/

function cargar_datos() {
    const datos = JSON.parse(datos_guardados);

    monto_prestamo.value =
        datos.monto_prestamo || "";

    tasa_interes.value =
        datos.tasa_interes || "";

    numero_cuotas.value =
        datos.numero_cuotas || "";

    if (datos.resultado) {
        mostrar_resultado(datos.resultado);
    }
}

/*------------------------------*/
/*--|guardar_datos|--*/
/*------------------------------*/

function guardar_datos(resultado = null) {
    const datos = {
        monto_prestamo: monto_prestamo.value,
        tasa_interes: tasa_interes.value,
        numero_cuotas: numero_cuotas.value,
        resultado: resultado
    };

    localStorage.setItem(
        "datos_amortizacion",
        JSON.stringify(datos)
    );
}

/*------------------------------*/
/*--|calcular_amortizacion|--*/
/*------------------------------*/

function calcular_amortizacion() {
    const monto = Number(monto_prestamo.value);
    const tasa_anual = Number(tasa_interes.value);
    const cuotas = Number(numero_cuotas.value);

    if (monto <= 0 || cuotas <= 0 || tasa_anual < 0) {
        alert("Ingresa datos válidos para calcular.");
        return;
    }

    const tasa_mensual =
        tasa_anual / 100 / 12;

    let cuota;

    if (tasa_mensual === 0) {
        cuota = monto / cuotas;
    } else {
        cuota =
            monto *
            (tasa_mensual *
            Math.pow(1 + tasa_mensual, cuotas)) /
            (Math.pow(1 + tasa_mensual, cuotas) - 1);
    }

    const total = cuota * cuotas;
    const intereses = total - monto;

    const resultado = {
        cuota: cuota,
        intereses: intereses,
        total: total,
        tasa_mensual: tasa_mensual,
        cuotas: cuotas
    };

    mostrar_resultado(resultado);
    generar_tabla(monto, resultado);
    guardar_datos(resultado);
}

/*------------------------------*/
/*--|mostrar_resultado|--*/
/*------------------------------*/

function mostrar_resultado(resultado) {
    cuota_mensual.textContent =
        formato_moneda(resultado.cuota);

    total_intereses.textContent =
        formato_moneda(resultado.intereses);

    total_pagado.textContent =
        formato_moneda(resultado.total);

    generar_tabla(
        Number(monto_prestamo.value),
        resultado
    );
}

/*------------------------------*/
/*--|generar_tabla|--*/
/*------------------------------*/

function generar_tabla(monto, resultado) {
    cuerpo_tabla.innerHTML = "";

    let saldo = monto;

    for (let i = 1; i <= resultado.cuotas; i++) {
        const interes = saldo * resultado.tasa_mensual;
        const capital = resultado.cuota - interes;

        saldo = saldo - capital;

        if (saldo < 0) {
            saldo = 0;
        }

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${i}</td>
            <td>${formato_moneda(resultado.cuota)}</td>
            <td>${formato_moneda(interes)}</td>
            <td>${formato_moneda(capital)}</td>
            <td>${formato_moneda(saldo)}</td>
        `;

        cuerpo_tabla.appendChild(fila);
    }
}

/*------------------------------*/
/*--|formato_moneda|--*/
/*------------------------------*/

function formato_moneda(valor) {
    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    ).format(valor);
}

/*------------------------------*/
/*--|limpiar_datos|--*/
/*------------------------------*/

function limpiar_datos() {
    monto_prestamo.value = "";
    tasa_interes.value = "";
    numero_cuotas.value = "";

    cuota_mensual.textContent = "$0";
    total_intereses.textContent = "$0";
    total_pagado.textContent = "$0";

    cuerpo_tabla.innerHTML = "";

    localStorage.removeItem(
        "datos_amortizacion"
    );
}

/*------------------------------*/
/*--|guardar_al_escribir|--*/
/*------------------------------*/

monto_prestamo.addEventListener(
    "input",
    guardar_datos
);

tasa_interes.addEventListener(
    "input",
    guardar_datos
);

numero_cuotas.addEventListener(
    "input",
    guardar_datos
);

/*------------------------------*/
/*--|eventos_principales|--*/
/*------------------------------*/

boton_calcular.addEventListener(
    "click",
    calcular_amortizacion
);

boton_limpiar.addEventListener(
    "click",
    limpiar_datos
);