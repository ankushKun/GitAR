
# SETUP

```bash
ardrive generate-seedphrase
```

```bash
ardrive generate-wallet -s "PHRASE" > wallet.json
```

```bash
ardrive create-drive -w wallet.json -n apps --turbo
```

- Copy Drive entity id and folder entity id

```bash
ardrive create-folder -w wallet.json -n "gitar" -F "FOLDER_EID" --turbo
```

- Copy Folder entity id

