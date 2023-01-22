This is an app to help practicing test questions.

## Getting Started

Install dependencies

```bash
yarn install
```

Open 3 terminals

In first terminal run questions server:

```bash
yarn json-server questions.json -p 3030
```

In second terminal run answers server:

```bash
yarn json-server answers.json -p 3333
```

In last terminal run app:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Upload question db

To load new question db, replace `questions.json` with the new db and delete entries in `answers.json`.
