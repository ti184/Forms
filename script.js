document.addEventListener('DOMContentLoaded', () => {
    const questionarioForm = document.getElementById('questionarioForm');
    const btnCalcular = document.getElementById('btnCalcular');
    
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

    let meuGrafico; // Variável para armazenar a instância do gráfico

     function gerarInterpretacao(nomeEixo, scoreInterno, scoreExterno) {
        let tituloResultado = '';
        let textoResultado = '';

        if (scoreInterno >= 7.5 && scoreExterno >= 7.5) {
            tituloResultado = 'Resultado Alto–Alto';
            textoResultado = 'Você já atua bem e se sente bem. Mantenha rituais de manutenção: feedback contínuo, mentoria reversa e metas de impacto.';
        } else if (scoreInterno >= 7.5 && scoreExterno <= 6.0) {
            tituloResultado = 'Resultado Alto–Baixo';
            textoResultado = 'Você faz, mas não se sente seguro. Trabalhe confiança e narrativa pessoal. Combine feedbacks positivos, registros de conquistas e pequenas vitórias visíveis.';
        } else if (scoreInterno <= 6.0 && scoreExterno >= 7.5) {
            tituloResultado = 'Resultado Baixo–Alto';
            textoResultado = 'Você quer e se sente pronto, porém falta base prática. Defina microdesafios com prazos curtos, pratique delegação guiada e estudo dirigido.';
        } else if (scoreInterno <= 6.0 && scoreExterno <= 6.0) {
            tituloResultado = 'Resultado Baixo–Baixo';
            textoResultado = 'Estado de latência. Comece com iniciativas de baixo risco, dupla de aprendizagem, observação estruturada de líderes e reflexão semanal guiada.';
        } else {
            tituloResultado = 'Perfil em Desenvolvimento';
            textoResultado = 'Suas pontuações indicam um equilíbrio entre competência e percepção que está em fase de desenvolvimento. Continue praticando e refletindo para fortalecer esta área.';
        }
        
        // Retorna o HTML formatado para este eixo
        return `
            <div class="interpretacao-eixo">
                <h3>${nomeEixo}</h3>
                <h4>${tituloResultado}</h4>
                <p>${textoResultado}</p>
            </div>
        `;
    }


    // Evento de clique no botão de calcular
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

        // Calcula as pontuações
        const pontuacoesA = [
            (respostas.slice(0, 3).reduce((a, b) => a + b, 0) / 3) * 2,
            (respostas.slice(6, 9).reduce((a, b) => a + b, 0) / 3) * 2,
            (respostas.slice(12, 15).reduce((a, b) => a + b, 0) / 3) * 2,
            (respostas.slice(18, 21).reduce((a, b) => a + b, 0) / 3) * 2
        ];
        
        const pontuacoesB = [
            (respostas.slice(3, 6).reduce((a, b) => a + b, 0) / 3) * 2,
            (respostas.slice(9, 12).reduce((a, b) => a + b, 0) / 3) * 2,
            (respostas.slice(15, 18).reduce((a, b) => a + b, 0) / 3) * 2,
            (respostas.slice(21, 24).reduce((a, b) => a + b, 0) / 3) * 2
        ];

        // Cria o gráfico
        const ctx = document.getElementById('graficoRadar').getContext('2d');
        
        // Destrói o gráfico anterior se ele existir
        if (meuGrafico) {
            meuGrafico.destroy();
        }

        meuGrafico = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: eixos,
                datasets: [{
                    label: 'Competência Percebida',
                    data: pontuacoesA,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    borderWidth: 2
                }, {
                    label: 'Percepção/Sensação',
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
                        max: 10,
                        ticks: { stepSize: 2 }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Mapa de Liderança - ${nomeUsuario}`,
                        font: { size: 16 }
                    }
                }
            }
        });
        // --- BLOCO ADICIONADO ---
        // Gera e exibe a interpretação detalhada para cada eixo
        let htmlInterpretacao = '<h2>Análise Detalhada por Eixo</h2>';
        for (let i = 0; i < eixos.length; i++) {
            htmlInterpretacao += gerarInterpretacao(eixos[i], pontuacoesA[i], pontuacoesB[i]);
        }
        interpretacaoContainer.innerHTML = htmlInterpretacao;
        // --- FIM DO BLOCO ADICIONADO ---
    });
});