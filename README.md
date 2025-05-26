# Habits HUB

Una aplicació web per al seguiment d'hàbits personals, creada amb React.

## Característiques

- **Definir hàbits personals**: Crea i personalitza els teus propis hàbits per fer seguiment.
- **Marcar hàbits com completats**: Registra el teu progrés diari.
- **Calendari de compliment**: Visualitza el teu progrés en un format de calendari estil GitHub.
- **Gestió d'hàbits**: Edita o elimina hàbits fàcilment.
- **Persistència de dades**: Les teves dades es guarden localment al teu navegador.

## Històries d'usuari implementades

- **US-01**: Com a usuari, puc definir hàbits personals per portar el control de les meves rutines.
- **US-02**: Com a usuari, puc marcar hàbits com completats per saber si he seguit els meus objectius.
- **US-03**: Com a usuari, puc veure un calendari de compliment per visualitzar el meu progrés.
- **US-04**: Com a usuari, puc eliminar hàbits antics per mantenir només els rellevants.

## Requisits previs

- Node.js (versió 14 o superior)
- npm (normalment ve amb Node.js)

## Instal·lació

1. Clona aquest repositori o descarrega'l
2. Obre una terminal a la carpeta del projecte
3. Instal·la les dependències:

```
npm install
```

4. Inicia l'aplicació en mode desenvolupament:

```
npm start
```

5. Obre [http://localhost:3000](http://localhost:3000) al teu navegador per veure l'aplicació.

## Ús

### Afegir un nou hàbit

1. A la vista de "Llista d'Hàbits", omple el formulari amb el nom i la descripció opcional de l'hàbit.
2. Fes clic a "Afegir Hàbit".

### Marcar un hàbit com completat

1. A la llista d'hàbits, fes clic al botó circular al costat de l'hàbit per marcar-lo com a completat per avui.
2. Per desfer l'acció, torna a fer clic al mateix botó.

### Veure el calendari de progrés

1. Fes clic al botó "Calendari de Progrés" a la part superior.
2. Selecciona l'hàbit que vols visualitzar al menú desplegable.
3. El calendari mostrarà els dies en què has completat aquest hàbit.

### Editar o eliminar un hàbit

- Per editar: Fes clic al botó d'edició (✏️) al costat de l'hàbit.
- Per eliminar: Fes clic al botó d'eliminació (🗑️) i confirma.

## Tecnologies utilitzades

- React
- localStorage per persistència de dades
- react-calendar-heatmap per visualització de calendari
- react-toastify per notificacions
- date-fns per manipulació de dates
- UUID per generació d'identificadors únics

## Llicència

Aquest projecte està llicenciat sota la Llicència MIT.
