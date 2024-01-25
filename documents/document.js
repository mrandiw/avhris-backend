const moment = require("moment");
module.exports = (data) => {
  const {
    payrun_period,
    emp_id,
    payrun_salary,
    payrun_total_overtime,
    payrun_allowance,
    payrun_total_deduct_attendance,
    payrun_deduction,
    payrun_total_allowance,
    payrun_total_deduction,
    payrun_net_salary,
    company_id,
  } = data;

  const avatar =
    emp_id.emp_fullname.substr(0, 1) +
    emp_id.emp_fullname.substr(emp_id.emp_fullname.indexOf(" ") + 1, 1);

  function formatCurrency(number) {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(Math.round(number));
  }

  const overtimeAllowance = payrun_allowance.filter(
    (allowance) => allowance.name === "Tunjangan Lembur"
  );

  const payrunDeductions = payrun_deduction.map((deduction) => {
    return { name: deduction.name, total: deduction.total };
  });

  const FilterBpjsKesehatan5Percent = payrunDeductions.filter(
    (deduction) => deduction.name === "BPJS Kesehatan"
  );
  const bpjsKesehatan5Percent = FilterBpjsKesehatan5Percent.length
    ? FilterBpjsKesehatan5Percent[0].total
    : 0;
  const bpjsKesehatan5PercentValue =
    payrun_salary * (bpjsKesehatan5Percent / 100);

  const filterBpjsKesehatan4Percent = payrun_allowance.filter(
    (allowance) => allowance.name === "BPJS Kesehatan"
  );
  const bpjsKesehatan4Percent = filterBpjsKesehatan4Percent.length
    ? filterBpjsKesehatan4Percent[0].total
    : 0;
  const bpjsKesehatan4PercentTotal =
    payrun_salary * (bpjsKesehatan4Percent / 100);

  const FilterBpjsKetenagakerjaan8Koma7Percent = payrunDeductions.filter(
    (deduction) => deduction.name === "BPJS Ketenagakerjaan"
  );
  const bpjsKetenagakerjaan8Koma7Percent =
    FilterBpjsKetenagakerjaan8Koma7Percent.length
      ? FilterBpjsKetenagakerjaan8Koma7Percent[0].total
      : 0;
  const bpjsKetenagakerjaan8Koma7PercentValue =
    payrun_salary * (bpjsKetenagakerjaan8Koma7Percent / 100);

  const FilterBpjsKetenagakerjaan5Koma7Percent = payrun_allowance.filter(
    (allowance) => allowance.name === "BPJS Ketenagakerjaan"
  );
  const bpjsKetenagakerjaan5Koma7Percent =
    FilterBpjsKetenagakerjaan5Koma7Percent.length
      ? FilterBpjsKetenagakerjaan5Koma7Percent[0].total
      : 0;
  const bpjsKetenagakerjaan5Koma7PercentTotal =
    payrun_salary * (bpjsKetenagakerjaan5Koma7Percent / 100);

  const filterPphPasal21 = payrunDeductions.filter(
    (deduction) => deduction.name === "Pph Pasal 21"
  );
  const pphPasal21Percent = filterPphPasal21.length
    ? filterPphPasal21[0].total
    : 0;
  const pphPasal21Total = payrun_salary * (pphPasal21Percent / 100);

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>PDF Result</title>
        <style>
          body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
          * {
              box-sizing: border-box;
              -moz-box-sizing: border-box;
          }
          .page {
              width: 210mm;
              min-height: 297mm;
              padding: 10mm;
              /* margin: 10mm auto; */
              border-radius: 5px;
              background: white;
          }
          .subpage {
              /* padding: 0.75cm; */
              height: 257mm;
          }
          
          @page {
              size: A4;
              margin: 0;
          }
          @media print {
              html, body {
                  width: 210mm;
                  height: 297mm;        
              }
              .page {
                  margin: 0;
                  border: initial;
                  border-radius: initial;
                  width: initial;
                  min-height: initial;
                  box-shadow: initial;
                  background: initial;
                  page-break-after: always;
              }
          }

          .document-section {
            font-family: "Poppins", sans-serif;
            padding: 0px;
          }

          .company-name {
            display: block;
            font-size: 20px; 
            text-align: center;
          }

          .period {
            display: inline;
            font-size: 16px; 
            text-align: center;
          }

          .document-user-info {
            display: block;
            margin-top: 2.5rem;
            margin-bottom: 2.5rem;
          }

          .avatar {
            display: inline-block;
            color: white; 
            font-size: 16px; 
            margin-top: 15px;
            width: 48px;
            height: 48px;
          }
          table, th, td {
            border: 1px solid white;
          }
        </style>
      </head>

      <body>
      <div class="page">
        <div class="subpage">
          <div class="document-section">
            <p class="company-name">${company_id.company_name}</p>
            <div style="display: block; text-align: center; margin-top:-20px;">
              <p style="display: inline-block;">Periode</p>
              <p style="color: #318CE7; display: inline-block;">
                ${payrun_period.periodic_month} ${payrun_period.periodic_years}
              </p>
            </div>

            <table>
              <tr>
                <!-- <td>
                  <div style="display: inline-block; background-color: gray; width: 48px; height: 48px; border-radius: 999px; text-align: center;">
                    <div class="avatar">${avatar}</div>
                  </div>
                </td> -->
                <td>
                  <p style="color: #7CB9E8; font-size: 16px;">${
                    emp_id.emp_fullname
                  }</p>
                  <p style="font-size: 16px; margin-top: -10px;">${
                    emp_id.email
                  }</p>
                  <p style="margin-top: -10px;">Payslip for : 
                    <span style="color: #7CB9E8;">
                       ${moment(payrun_period.periodic_start_date).format(
                         "DD MMMM"
                       )} - ${moment(payrun_period.periodic_end_date).format(
    "DD MMMM"
  )}
                    </span>
                  </p>
                  <p style="margin-top: -10px;">Created at : ${moment(
                    payrun_period.periodic_end_date
                  ).format("DD MMMM")}</p>
                  <p style="margin-top: -10px;">Designation : ${
                    emp_id.emp_desid.des_name
                  }</p>
                  <p style="margin-top: -10px;">Departement : ${
                    emp_id.emp_depid.dep_name
                  }</p>
                </td>
            </table>
            
            <table>
              <tr>
                <td>
                  <span style="display: inline-block; text-align: left; background-color: #E5E7EB; padding: 10px; margin-right: 10px; width: 91mm;">Gaji Pokok :</span>
                </td>
                <td>
                   <span style="display: inline-block; text-align: right; background-color: #E5E7EB; padding: 10px; margin-left: 10px; width: 91mm;">${formatCurrency(
                     payrun_salary || 0
                   )}</span>
                </td>
              </tr>
            </table>

            <div style="display: inline-block; margin-top: 10px; width: 100%;  border-top: 1px solid gray;">
            </div>

            <p style="text-align: center; font-size: 18px; font-weight: bold;">
              Rincian Penghasilan
            </p>

            <table>
              <tr>
                <td>
                  <span style="display: inline-block; width: 91mm; text-align: center; padding: 10px; margin-right: 10px;">Tunjangan</span>
                </td>
                <td>
                  <span style="display: inline-block; width: 91mm; text-align: center; padding: 10px; margin-left: 10px;">Potongan</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span style="display: inline-block; width: 45.5mm; background-color: #E5E7EB; text-align: left; padding: 10px;">Lembur / Overtime</span>
                  <span style="display: inline-block; text-align: right; width: 45.5mm; background-color: #E5E7EB; padding: 10px; margin-left: -5px;">${formatCurrency(
                    payrun_total_overtime || 0
                  )}</span>
                </td>
                <td>
                  <span style="display: inline-block; width: 45.5mm; background-color: #E5E7EB; text-align: left; padding: 10px; margin-left: 10px;">Potongan Absensi</span>
                  <span style="display: inline-block; text-align: right; width: 45.5mm; background-color: #E5E7EB; padding: 10px; margin-left: -5px;">${formatCurrency(
                    payrun_total_deduct_attendance || 0
                  )}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span style="display: inline-block; width: 45.5mm; background-color: #E5E7EB; text-align: left; padding: 10px;">Tunjangan Lembur</span>
                  <span style="display: inline-block; text-align: right; width: 45.5mm; background-color: #E5E7EB; padding: 10px; margin-left: -5px;">${formatCurrency(
                    overtimeAllowance.length ? overtimeAllowance[0].total : 0
                  )}</span>
                </td>
                <td>
                  <span style="display: inline-block; width: 45.5mm; background-color: #E5E7EB; text-align: left; padding: 10px; margin-left: 10px;">BPJS Kes. ${bpjsKesehatan5Percent}%</span>
                  <span style="display: inline-block; text-align: right; width: 45.5mm; background-color: #E5E7EB; padding: 10px; margin-left: -5px;">${formatCurrency(
                    bpjsKesehatan5PercentValue
                  )}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span style="display: inline-block; width: 45.5mm; background-color: #E5E7EB; text-align: left; padding: 10px;">BPJS Kes. ${bpjsKesehatan4Percent}%</span>
                  <span style="display: inline-block; text-align: right; width: 45.5mm; background-color: #E5E7EB; padding: 10px; margin-left: -5px;">${formatCurrency(
                    bpjsKesehatan4PercentTotal
                  )}</span>
                </td>
                <td>
                  <span style="display: inline-block; width: 48.5mm; background-color: #E5E7EB; text-align: left; padding: 10px; margin-left: 10px;">BPJS Ket. ${bpjsKetenagakerjaan8Koma7Percent}%</span>
                  <span style="display: inline-block; text-align: right; width: 42.5mm; background-color: #E5E7EB; padding: 10px; margin-left: -5px;">${formatCurrency(
                    bpjsKetenagakerjaan8Koma7PercentValue
                  )}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span style="display: inline-block; width: 48.5mm; background-color: #E5E7EB; text-align: left; padding: 10px;">BPJS Ket. ${bpjsKetenagakerjaan5Koma7Percent}%</span>
                  <span style="display: inline-block; text-align: right; width: 42.5mm; background-color: #E5E7EB; padding: 10px; margin-left: -5px;">${formatCurrency(
                    bpjsKetenagakerjaan5Koma7PercentTotal
                  )}</span>
                </td>
                <td>
                  <span style="display: inline-block; width: 45.5mm; background-color: #E5E7EB; text-align: left; padding: 10px; margin-left: 10px;">Pph Pasal 21</span>
                  <span style="display: inline-block; text-align: right; width: 45.5mm; background-color: #E5E7EB; padding: 10px; margin-left: -5px;">${formatCurrency(
                    pphPasal21Total
                  )}</span>
                </td>
              </tr>
            </table>

            <div style="display: inline-block; margin-top: 10px; width: 100%;  border-top: 1px solid gray;">
            </div>
            
            <table>
              <tr>
                <td>
                  <span style="display: inline-block; text-align: left; background-color: #E5E7EB; 100%; padding: 10px; margin-right: 10px; width: 91mm; font-weight: bold;">Total Tunjangan</span>
                </td>
                <td>
                  <span style="display: inline-block; text-align: right; background-color: #E5E7EB; 100%; padding: 10px; margin-left: 10px; width: 91mm; font-weight: bold;">${formatCurrency(
                    payrun_total_allowance
                  )}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span style="display: inline-block; text-align: left; background-color: #E5E7EB; 100%; padding: 10px; margin-right: 10px; width: 91mm; font-weight: bold;">Total Potongan</span>
                </td>
                <td>
                  <span style="display: inline-block; text-align: right; background-color: #E5E7EB; 100%; padding: 10px; margin-left: 10px; width: 91mm; font-weight: bold;">${formatCurrency(
                    payrun_total_deduction
                  )}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span style="display: inline-block; text-align: left; background-color: #E5E7EB; 100%; padding: 10px; margin-right: 10px; width: 91mm; font-weight: bold;">Total Potongan Kehadiran</span>
                </td>
                <td>
                  <span style="display: inline-block; text-align: right; background-color: #E5E7EB; 100%; padding: 10px; margin-left: 10px; width: 91mm; font-weight: bold;">${formatCurrency(
                    payrun_total_deduct_attendance
                  )}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span style="display: inline-block; text-align: left; background-color: #E5E7EB; 100%; padding: 10px; margin-right: 10px; width: 91mm; font-weight: bold;">Net Payable Salary</span>
                </td>
                <td>
                  <span style="display: inline-block; text-align: right; background-color: #E5E7EB; 100%; padding: 10px; margin-left: 10px; width: 91mm; font-weight: bold;">${formatCurrency(
                    payrun_net_salary
                  )}</span>
                </td>
              </tr>
            </table>

            <table>
              <tr>
                <td>
                  <p style="display: inline-block; font-weight: bold; margin-bottom: -20px; margin-top: 40px; text-align: center; width: 182mm;">Approved Finance,</p>
                  <p style="display: inline-block; font-weight: bold; margin-top: -10px; margin-bottom: 40px; text-align: center; width: 182mm;">${
                    company_id.company_name
                  }</p>
                  <p style="display: inline-block; font-weight: bold; text-align: center; width: 182mm; margin-top:40px;">(HR/Adm : 08/08/2023 13:40 PM)</p>
                </td>
              </tr>
            </table>
          </div>
          </div>
          </div>
      </body>
    </html>
  `;
};
