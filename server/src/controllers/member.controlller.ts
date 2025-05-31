// app.get("/populate", async (req: Request, res: Response) => {
  //   const auth = new google.auth.GoogleAuth({
  //     keyFile: "credentials.json",
  //     scopes: "https://www.googleapis.com/auth/spreadsheets",
  //   });

  //   //create client instance for auth
  //   const client = await auth.getClient();

  //   //create instance of google sheets api
  //   const googleSheets = google.sheets({ version: "v4" });

  //   const spreadsheetId: string =
  //     "1nKzSKVmnGZehNvCjfsmofwGxlOUe16rz8rf2KR5Nkws";

  //   //get metadata about spreadsheet (TEST)
  //   const metadata = await googleSheets.spreadsheets.get({
  //     auth,
  //     spreadsheetId,
  //   });

  //   //read rows from spreadsheet
  //   const rowsResult: GaxiosResponse<sheets_v4.Schema$ValueRange> =
  //     await googleSheets.spreadsheets.values.get({
  //       auth,
  //       spreadsheetId,
  //       range: "Form Responses 1!A2:Y",
  //     });

  //   const rows = rowsResult.data.values;

  //   if (!rows || rows.length < 1) {
  //     return res.status(404).send("No data found in spreadsheet");
  //   }

  //   for (const row of rows) {
  //     const firstName = row[4];
  //     const middleName = row[5];
  //     const lastName = row[3];
  //     const studentNo = row[21];
  //     const email = row[12];
  //     const hauEmail = row[6];
  //     const program = row[10];

  //     console.log("First name: ", firstName);
  //     console.log("Middle name: ", middleName);
  //     console.log("Last name: ", firstName);
  //     console.log("Student no: ", studentNo);
  //     console.log("email: ", email);
  //     console.log("hau email: ", hauEmail);
  //     console.log("program: ", program);

  //     if (studentNo.length > 8) {
  //       console.log("This motherfucker: ", studentNo);
  //     }

  //     await pool.query(
  //       `INSERT INTO members (
  //     first_name, middle_name, last_name,
  //     student_no, email, hau_email, program
  //   ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  //       [firstName, middleName, lastName, studentNo, email, hauEmail, program]
  //     );
  //   }

  //   res.status(200).send("Data inserted successfully");
  // });