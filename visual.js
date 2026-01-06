    
    // Lakukan update visual untuk tabel matriks dan data
    // Update visaul
    function updateVisualization() {
      visualization.innerHTML = '';


      // Ambil Query TANPA thead, karena thead hanya nama vairable dan deskripsi fungsi atau rhs
      // Take query WITHJPUT thead, thead serves as varibale naming and rhs, for visual only
      // If taken, will make error due to the first function is NaN
      const rows = matrixContainer.querySelectorAll('tbody tr');
      if (rows.length === 0) return;

      const cols = rows[0].querySelectorAll('input').length - 1;
      const varNames = generateVarNames(cols);

      rows.forEach((row, rowIndex) => {
        const inputs = Array.from(row.querySelectorAll('input'));
        if (inputs.length === 0) return;

        let eq = '';
        
        // Cek f(x) untuk semua variable
        // Get right hand side (RHS) for each function variable
        let hasRHS = false;
        
        inputs.forEach((input, i) => {
          const raw = input.value;
          const coeff = Number(raw);

          if (i < inputs.length - 1) {
            
            // Kalo imput ada yang bermasalah, tinggal saja
            // Return if input is problematic
            if (raw === '' || isNaN(coeff) || Math.abs(coeff) < 0.0001) {
                return;
            }

            const varName = varNames[i];
            
            // Format string biar kelihatan kalau -1 atau 1
            // Format string (handle 1 and -1)
            let coeffStr = formatNumberForDisplay(Math.abs(coeff));
            if (Math.abs(coeff) === 1) {
                coeffStr = '';
            }
            
            let term = coeffStr + varName;

            if (eq === '') {
              
              eq += (coeff < 0 ? '-' : '') + term;

            } else {
              
              eq += (coeff < 0 ? ' - ' : ' + ') + term;
            }
            
          } else {
            

            // Cek untuk RHS kalau kosong, tetap tampilkan fungsinya walau nilai f(x) belum tau
            // Even if the RHS is blank, we can still show the left side, 
            if (raw !== '' && !isNaN(coeff)) {
                hasRHS = true;
                if (eq === '') {
                  
                  eq = '0';
                }
                eq += ' = ' + formatNumberForDisplay(coeff);
            }
          }
        });

        
        // Tampilkan setelah punya deninisi fungsi dan hasil fungsi
        // Show hwen all part of equation is completed
        // LHS = RHS
        // Or show only LHS if RHS is not known
        if (eq !== '') {
        
            // Jika punya denifisi fungsi namun belum ada hasil fungsi, ganti menjadi tanda tanya '?'
            // If we have an LHS but no RHS, add "= ?" for clarity in visualization
            let finalEq = eq;
            if (!hasRHS) {
              finalEq += ' = ?';
        }
          
            const p = document.createElement('p');

            // Regex, buang tanda tidak poenting seperti double spasi
            // Regex, Final cleanup: remove any double spacing or unnecessary '1's
            finalEq = finalEq.replace(/\s+/g, ' ').trim();
            finalEq = finalEq.replace(/([+\-])\s*1([a-z])/ig, '$1 $2').replace(/^-1([a-z])/i, '-$1');
            
            p.textContent = finalEq; 
            visualization.appendChild(p);
        }
      });
    }




    // Ubah matriks ke table di document
    // Render matriks to table in document
    function renderMatrixTable(M, varNames) {
        const tbl = document.createElement('table');
        const n = M.length; const m = M[0].length;
        const thead = document.createElement('thead');
        const hr = document.createElement('tr');

        for (let c = 0; c < m - 1; c++) {
            const th = document.createElement('th'); th.textContent = varNames[c].toUpperCase(); hr.appendChild(th);
        }

        const thR = document.createElement('th'); thR.textContent = 'RHS'; hr.appendChild(thR);
        thead.appendChild(hr); tbl.appendChild(thead);

        const tbody = document.createElement('tbody');

        for (let i = 0; i < n; i++) {

            const tr = document.createElement('tr');
            for (let j = 0; j < m; j++) {
                const td = document.createElement('td'); td.textContent = formatNumberForDisplay(M[i][j]); tr.appendChild(td);
            }

            tbody.appendChild(tr);
        }

        tbl.appendChild(tbody);

        return tbl;
    }