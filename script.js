document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do HTML
    const questionarioForm = document.getElementById('questionarioForm');
    const btnCalcular = document.getElementById('btnCalcular');
    const btnBaixarPDF = document.getElementById('btnBaixarPDF');
    const interpretacaoContainer = document.getElementById('interpretacaoContainer');
    
    const eixos = [
        'Iniciativa e protagonismo', 
        'Capacidade de inspirar confiança', 
        'Abertura ao aprendizado e autocrítica', 
        'Vigilância ética e resiliência'
    ];

    const perguntas = [
        // Eixo 1: Iniciativa e protagonismo
        "Tomo a frente quando percebo que algo precisa ser feito.", "Proponho ideias mesmo sem ter um cargo formal.", "Crio movimento quando o grupo está parado.",
        "Sinto-me confortável ao iniciar algo novo.", "Quando lidero sem “permissão”, fico mais motivado do que ansioso.", "Vejo sentido e energia nesses começos, não apenas pressão.",
        // Eixo 2: Influência e confiança
        "Pessoas me procuram para pedir opinião ou orientação.", "Consigo engajar colegas em metas comuns.", "Minha atuação gera confiança no grupo.",
        "Quando sou referência, sinto-me preparado e sereno.", "Não me sinto sobrecarregado quando esperam direção de mim.", "Sinto que mereço a confiança que recebo.",
        // Eixo 3: Aprendizado e autocrítica
        "Busco feedback e aplico melhorias.", "Transformo erros em aprendizagem concreta.", "Uno teoria e prática nas decisões que tomo.",
        "Feedback me anima a evoluir, não me desanima.", "Sinto que estou crescendo como líder mês a mês.", "Encaro desafios como oportunidade, não como ameaça.",
        // Eixo 4: Vigilância ética e resiliência
        "Considero efeitos éticos antes de decidir.", "Ajusto o rumo quando percebo incoerências.", "Estimulo discordâncias respeitosas para melhorar decisões.",
        "Em dilemas morais, mantenho clareza e calma.", "Tenho coragem para sustentar valores sob pressão.", "Sinto-me íntegro ao comparar meios e fins das minhas decisões."
    ];

    // Cria as perguntas dinamicamente na página
    perguntas.forEach((pergunta, index) => {
        const perguntaDiv = document.createElement('div');
        perguntaDiv.classList.add('pergunta');
        const perguntaP = document.createElement('p');
        perguntaP.textContent = `${index + 1}. ${pergunta}`;
        perguntaDiv.appendChild(perguntaP);
        const opcoesDiv = document.createElement('div');
        opcoesDiv.classList.add('opcoes-resposta');
        for (let i = 1; i <= 5; i++) {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `pergunta-${index}`;
            input.value = i;
            input.required = true;
            label.appendChild(input);
            label.appendChild(document.createTextNode(i));
            opcoesDiv.appendChild(label);
        }
        perguntaDiv.appendChild(opcoesDiv);
        questionarioForm.appendChild(perguntaDiv);
    });

    let meuGrafico;

    function gerarInterpretacao(nomeEixo, scoreInterno, scoreExterno) {
        let tituloResultado = '';
        let textoResultado = '';
        if (scoreInterno >= 7.5 && scoreExterno >= 7.5) {
            tituloResultado = 'Potencial Consolidado (Alto–Alto)';
            textoResultado = 'Sua prática e sua percepção interna estão alinhadas e em alto nível. Continue aprimorando com mentoria reversa, buscando feedback 360 e liderando projetos desafiadores.';
        } else if (scoreInterno <= 6.0 && scoreExterno >= 7.5) {
            tituloResultado = 'Síndrome do Impostor (Baixo–Alto)';
            textoResultado = 'Você entrega resultados, mas sua autoconfiança está baixa. Foque em celebrar pequenas vitórias, registrar conquistas e buscar um mentor para validar suas competências.';
        } else if (scoreInterno >= 7.5 && scoreExterno <= 6.0) {
            tituloResultado = 'Potencial Latente (Alto–Baixo)';
            textoResultado = 'Você se sente pronto, mas ainda não demonstra essa competência na prática. Busque oportunidades proativamente, peça para liderar pequenas iniciativas e estude casos práticos.';
        } else if (scoreInterno <= 6.0 && scoreExterno <= 6.0) {
            tituloResultado = 'Ponto de Partida (Baixo–Baixo)';
            textoResultado = 'Este é o início da sua jornada. Comece observando líderes que admira, forme uma dupla de aprendizagem com um colega e defina metas de desenvolvimento pequenas e semanais.';
        } else {
            tituloResultado = 'Perfil em Desenvolvimento';
            textoResultado = 'Suas pontuações indicam um equilíbrio que está em evolução. Continue investindo em autoconhecimento e prática deliberada para fortalecer suas habilidades nesta área.';
        }
        return `<div class="interpretacao-eixo"><h3>${nomeEixo}</h3><h4>${tituloResultado}</h4><p>${textoResultado}</p></div>`;
    }

    btnCalcular.addEventListener('click', () => {
        const nomeUsuario = document.getElementById('nomeUsuario').value;
        if (!nomeUsuario) {
            alert('Por favor, digite seu nome.');
            return;
        }
        const form = new FormData(questionarioForm);
        const respostas = Array.from(form.values()).map(Number);
        if (respostas.length < perguntas.length) {
            alert('Por favor, responda a todas as perguntas.');
            return;
        }
        // Score Externo (Competência Percebida)
        const pontuacoesA = [
            (respostas.slice(0, 3).reduce((a, b) => a + b, 0) / 3) * 2,
            (respostas.slice(6, 9).reduce((a, b) => a + b, 0) / 3) * 2,
            (respostas.slice(12, 15).reduce((a, b) => a + b, 0) / 3) * 2,
            (respostas.slice(18, 21).reduce((a, b) => a + b, 0) / 3) * 2
        ];
        // Score Interno (Percepção/Sensação)
        const pontuacoesB = [
            (respostas.slice(3, 6).reduce((a, b) => a + b, 0) / 3) * 2,
            (respostas.slice(9, 12).reduce((a, b) => a + b, 0) / 3) * 2,
            (respostas.slice(15, 18).reduce((a, b) => a + b, 0) / 3) * 2,
            (respostas.slice(21, 24).reduce((a, b) => a + b, 0) / 3) * 2
        ];
        const ctx = document.getElementById('graficoRadar').getContext('2d');
        if (meuGrafico) {
            meuGrafico.destroy();
        }
        meuGrafico = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: eixos,
                datasets: [{
                    label: 'Competência Percebida (Ação Externa)',
                    data: pontuacoesA,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    borderWidth: 2
                }, {
                    label: 'Percepção/Sensação (Visão Interna)',
                    data: pontuacoesB,
                    borderColor: 'orange',
                    backgroundColor: 'rgba(255, 165, 0, 0.25)',
                    borderWidth: 2
                }]
            },
            options: { 
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        });
        
        let htmlInterpretacao = '<h2>Análise Detalhada por Eixo</h2>';
        for (let i = 0; i < eixos.length; i++) {
            htmlInterpretacao += gerarInterpretacao(eixos[i], pontuacoesB[i], pontuacoesA[i]);
        }
        interpretacaoContainer.innerHTML = htmlInterpretacao;
        
        btnBaixarPDF.style.display = 'block';
    });

    // --- BLOCO ATUALIZADO: Lógica para gerar PDF com o gráfico na página 1 e a análise na página 2 ---
    btnBaixarPDF.addEventListener('click', () => {
        const nomeUsuario = document.getElementById('nomeUsuario').value || 'resultado';
        const graficoDiv = document.querySelector('.resultado-container');
        const interpretacaoDiv = document.getElementById('interpretacaoContainer');
        
        btnBaixarPDF.textContent = 'Gerando PDF...';
        btnBaixarPDF.disabled = true;

        const options = { scale: 2, useCORS: true };
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Passo 1: Capturar o gráfico
        html2canvas(graficoDiv, options).then(canvasGrafico => {
            // Adicionar imagem do gráfico na primeira página
            const imgGraficoData = canvasGrafico.toDataURL('image/png');
            const imgGraficoProps = pdf.getImageProperties(imgGraficoData);
            const pdfGraficoWidth = pdf.internal.pageSize.getWidth() - 20; // Deixa 10mm de margem em cada lado
            const pdfGraficoHeight = (imgGraficoProps.height * pdfGraficoWidth) / imgGraficoProps.width;
            const xOffset = (pdf.internal.pageSize.getWidth() - pdfGraficoWidth) / 2; // Centraliza o gráfico
            pdf.addImage(imgGraficoData, 'PNG', xOffset, 20, pdfGraficoWidth, pdfGraficoHeight);

            // Passo 2: Capturar a interpretação
            html2canvas(interpretacaoDiv, {...options, windowHeight: interpretacaoDiv.scrollHeight }).then(canvasInterpretacao => {
                // Adicionar nova página para a análise
                pdf.addPage();
                
                const imgWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgHeight = canvasInterpretacao.height * imgWidth / canvasInterpretacao.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(canvasInterpretacao, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                // Adiciona mais páginas se a análise for muito longa
                while (heightLeft > 0) {
                  position = -heightLeft;
                  pdf.addPage();
                  pdf.addImage(canvasInterpretacao, 'PNG', 0, position, imgWidth, imgHeight);
                  heightLeft -= pageHeight;
                }
                
                // Passo 3: Salvar o PDF completo
                pdf.save(`relatorio_lideranca_${nomeUsuario.toLowerCase().replace(/ /g, '_')}.pdf`);

                // Restaurar o botão
                btnBaixarPDF.textContent = 'Baixar Relatório em PDF';
                btnBaixarPDF.disabled = false;
            });
        });
    });
});