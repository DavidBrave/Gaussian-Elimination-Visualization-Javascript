

    function generateMatrix() {
      const n = parseInt(matrixSizeInput.value, 10);
      if (!Number.isInteger(n) || n < 1) return;

      matrixContainer.innerHTML = '';
      const varNames = generateVarNames(n).map(s => s.toUpperCase());

      const table = document.createElement('table');
      table.setAttribute('aria-label', `Augmented matrix ${n} by ${n+1}`);


      
      // Buat matriks dan hasil fungsi atau augmented matriks
      const thead = document.createElement('thead');
      const hr = document.createElement('tr');

      for (let c = 0; c < n; c++) {
        const th = document.createElement('th');
        th.textContent = varNames[c];
        hr.appendChild(th);
      }

      const thRHS = document.createElement('th');
      thRHS.textContent = 'RHS';


      hr.appendChild(thRHS);
      thead.appendChild(hr);
      table.appendChild(thead);
      

      // Buat table body dari input
      // Create table body from input
      const tbody = document.createElement('tbody');

      for (let r = 0; r < n; r++) {
        const tr = document.createElement('tr');

        for (let c = 0; c < n + 1; c++) {

          const td = document.createElement('td');
          const input = document.createElement('input');
          input.type = 'number';
          input.step = 'any';
          input.dataset.r = r;
          input.dataset.c = c;

          
          input.addEventListener('input', updateVisualization); 
          td.appendChild(input);
          tr.appendChild(td);

        }

        tbody.appendChild(tr);

      }
      
      table.appendChild(tbody);
      matrixContainer.appendChild(table);
      updateVisualization();
    }

    function clearValues() {
      const inputs = matrixContainer.querySelectorAll('input');
      inputs.forEach(i => i.value = '');
      updateVisualization();
      solution.innerHTML = '';
    }




    // Ambil matriks dari document object
    // Create matrix from document object model
    function getMatrixFromDOM() {

        // Query baris di tbody, bukan thead
        // Query rows inside the tbody, excluding the thead
        const rows = Array.from(matrixContainer.querySelectorAll('tbody tr'));
        if (rows.length === 0) return null;
        const n = rows.length; 
        const m = rows[0].querySelectorAll('input').length;
      
      const A = new Array(n);
      for (let i = 0; i < n; i++) {

        const inputs = rows[i].querySelectorAll('input');
        A[i] = new Array(m);

        for (let j = 0; j < m; j++) {

          const v = inputs[j].value;

          // Jaga-jaga input NaN
          // In cases input might be NaN
          const num = Number(v);
          A[i][j] = v === '' || isNaN(num) ? 0 : num;
        }
      }
      return A;
    }

    function cloneMatrix(M) {
      return M.map(r => r.slice());
    }



    // Penyelesaian
    // Solbver
    function solveAndExplain() {
      solution.innerHTML = '';
      const M = getMatrixFromDOM();
      if (!M) return;
      const n = M.length; const m = M[0].length;
      const varNames = generateVarNames(m - 1).map(s => s);

      // Step 0 : Buat augmented matriks
      // Step 0 : Initial augmented matrix
      const step0 = document.createElement('div'); step0.className = 'step';
      const h0 = document.createElement('h4'); h0.textContent = 'Augmented Matriks Awal';
      step0.appendChild(h0);
      step0.appendChild(renderMatrixTable(M, varNames));
      solution.appendChild(step0);

      // Buat matriks A untuk dihitung (biar tidak merusak matriks awal)
      // Clone matrix to be used, in case need initial matrx
      const A = cloneMatrix(M);

      // Ambil diagonal utama
      // Take makin diagonal from pivot index
      for (let pivot = 0; pivot < n; pivot++) {

        // Cek apakah nilai pivot 0, jika 0, swap
        // Mengapa pakai 0.0001, jaga-jaga javascript bisa bermasalah dengan floating point
        // Find non-zero pivot. If zero swap with lower row
        if (Math.abs(A[pivot][pivot]) < 0.0001) {

          let swapped = false;
          for (let r = pivot + 1; r < n; r++) {
            if (Math.abs(A[r][pivot]) > 0.0001) {

                // Swap baris pivot dengan baris r
                // Swap rows pivot and r
                const tmp = A[pivot]; A[pivot] = A[r]; A[r] = tmp;
                const stepSwap = document.createElement('div'); stepSwap.className = 'step';
                const hs = document.createElement('h4'); hs.textContent = `Swap baris ${pivot+1} dan ${r+1} `;
                stepSwap.appendChild(hs);
                stepSwap.appendChild(renderMatrixTable(A, varNames));
                solution.appendChild(stepSwap);
                swapped = true; break;
            }
          }

          if (!swapped) continue;
        }

        
        for (let target = pivot + 1; target < n; target++) {
            if (Math.abs(A[target][pivot]) < 0.0001) continue;

            // Ubah pembulatan ke Integer, lalu cari KPK
            // compute integer LCM,  using rounded integer
            const a = Math.round(A[pivot][pivot]*1000000);
            const b = Math.round(A[target][pivot]*1000000);
            const common = lcm(Math.abs(a), Math.abs(b));
            let mulPivot = common / a;
            let mulTarget = common / b;

        
            // Cari KPK, pivot dikalikan dengan hasil bagi KPK dengan row target berikutnya
            mulPivot = Math.round(mulPivot);
            mulTarget = Math.round(mulTarget);

            const stepElim = document.createElement('div'); stepElim.className = 'step';
            const h = document.createElement('h4'); h.textContent = `Eliminasi kolom ${pivot+1} di baris ${target+1} dengan KPK (${mulPivot} × R${pivot+1} dan ${mulTarget} × R${target+1})`;
            stepElim.appendChild(h);

            // Buat div dan tabel untuk ditampilkan
            // Make div and table to shiow visualization
            const scaledView = document.createElement('div'); scaledView.className = 'matrix-box';
            const scaledTbl = document.createElement('table');

            
            const thead = document.createElement('thead');
            const hr = document.createElement('tr');

            for (let c = 0; c < m - 1; c++) { 
                const th = document.createElement('th'); 
                th.textContent = varNames[c].toUpperCase(); 
                hr.appendChild(th); 
            }

            // Hasil fungsi atau right hand side (RHS)
            hr.appendChild(document.createElement('th')).textContent = 'RHS';
            thead.appendChild(hr); scaledTbl.appendChild(thead);

            
            // Row KPK hasil kali mulktiplier untuk pivot dan target
            const tb = document.createElement('tbody');
            const r1 = document.createElement('tr');
            const r2 = document.createElement('tr');
            for (let c = 0; c < m; c++) {
                const td1 = document.createElement('td'); 
                td1.textContent = formatNumberForDisplay(A[pivot][c] * mulPivot); 
                r1.appendChild(td1);
                
                
                const td2 = document.createElement('td'); 
                td2.textContent = formatNumberForDisplay(A[target][c] * mulTarget); 
                r2.appendChild(td2);
            }

            // Append data row baru ke tabel untuk ditampilkan
            tb.appendChild(r1); 
            tb.appendChild(r2); 
            scaledTbl.appendChild(tb);


            scaledView.appendChild(document.createTextNode('Baris yang akan dilakukan pengurangan (eliminasi):')); 
            scaledView.appendChild(scaledTbl);

            // Tabel setelah eliminasi
            // Table after elimination
            // Make another backup matrix, karena ssudah terjadi salah
            const afterElim = cloneMatrix(A);
            for (let c = 0; c < m; c++) {

                // Kurangi kolom yang ingin di nol kan agar segitiga atas
                afterElim[target][c] = (mulTarget * A[target][c]) - (mulPivot * A[pivot][c]);
                
                // Kalau 0, biarkan 0
                if (Math.abs(afterElim[target][c]) < 0.0001) afterElim[target][c] = 0;
            }

            // Gunakan FPB untuk membagi biar angka fungsi tidak terlalu besar
            const intRow = afterElim[target].map(v => Math.round(v * 1000000));
            let rowG = 0; for (let val of intRow) rowG = gcd(rowG, val);

            if (rowG === 0) rowG = 1;

            for (let c = 0; c < m; c++) {
                afterElim[target][c] = afterElim[target][c] / (rowG / 1000000);
                if (Math.abs(afterElim[target][c]) < 0.0001) afterElim[target][c] = 0;
            }

            // Buat 2 tabel perbandingan yang angka KPK dan angka hasil akhir seletelah eliminasi dan dibagi FPB biar angka lebih kecil
            const two = document.createElement('div'); two.className = 'two-tables';
            const div1 = document.createElement('div'); div1.className = 'matrix-box'; div1.appendChild(scaledView);
            const div2 = document.createElement('div'); div2.className = 'matrix-box'; div2.appendChild(document.createTextNode('Matriks setelah eliminasi')); div2.appendChild(renderMatrixTable(afterElim, varNames));
            two.appendChild(div1); two.appendChild(div2);

            stepElim.appendChild(two);

            
            for (let c = 0; c < m; c++) A[target][c] = afterElim[target][c];
            solution.appendChild(stepElim);
        
        }
      }

      // A SEHARUSNYA sudah segitiga atas atau nilai seluruh elemen di bawah pivot = 0
      // Tunjukan
      // Get the Upper triangle and show it
      const stepTri = document.createElement('div'); stepTri.className = 'step';
      const htri = document.createElement('h4'); htri.textContent = 'Segitiga Atas';
      stepTri.appendChild(htri); stepTri.appendChild(renderMatrixTable(A, varNames)); solution.appendChild(stepTri);

      // Subtisuti dari belakang
      // Back substitution to solve
      const x = new Array(m-1).fill(0);
      
      let consistent = true;
      for (let i = n - 1; i >= 0; i--) {
        let s = 0; let pivotCol = -1;
        for (let j = 0; j < m - 1; j++) {
            if (Math.abs(A[i][j]) > 0.0001) 
            { 
                pivotCol = j; break; 
            }
        }
        if (pivotCol === -1) {
          
            if (Math.abs(A[i][m-1]) > 0.0001) 
            { 
                consistent = false; 
            }

          continue;
        }


        
        for (let j = pivotCol + 1; j < m - 1; j++) s += A[i][j] * x[j];
        const val = (A[i][m-1] - s) / A[i][pivotCol];
        x[pivotCol] = Math.abs(val) < 0.0001 ? 0 : val;

      }

      // Tampilakan penyelesaian variable
      // Show the solved variable
      const solDiv = document.createElement('div'); solDiv.className = 'step final-solution';
      const hs = document.createElement('h4'); hs.textContent = 'Solusi'; solDiv.appendChild(hs);
      if (!consistent) {
        const p = document.createElement('p'); p.textContent = 'Tidak bisa ditemukan solusi.'; solDiv.appendChild(p);
      } else {
        const ul = document.createElement('div');
        for (let i = 0; i < x.length; i++) {
          const p = document.createElement('p'); p.textContent = `${varNames[i].toUpperCase()} = ${formatNumberForDisplay(x[i])}`; ul.appendChild(p);
        }
        solDiv.appendChild(ul);
      }
      solution.appendChild(solDiv);

    }