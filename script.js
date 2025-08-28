// Garante que todos os elementos HTML existam antes de tentarmos manipulá-los:
document.addEventListener('DOMContentLoaded', () => {
    // Inialização da variáveis e elementos do jogo
    const emojis = ["😍","😍","😁","😁","😎","😎","🤢","🤢","😢","😢","🤣","🤣","😘","😘","😜","😜"];
    const gameContainer = document.querySelector('.game');
    const resetButtons = document.querySelectorAll('.reset');
    const attemptsDisplay = document.getElementById('attempts');
    const winMessage = document.querySelector('.win-message');

    // Variaveis de estado do jogo
    let shuf_emojis = [];
    let attempts = 0;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedPairs = 0;

    // Inicializando o jogo
    function initGame() {
        attempts = 0;
        matchedPairs = 0;
        attemptsDisplay.textContent = attempts;
        shuf_emojis = [...emojis].sort(() => Math.random() > 0.5 ? 2 : -1);
    
        //Função: Limpa o tabuleiro do jogo, removendo todas as cartas existentes
        //Detalhe: Prepara o container para receber as novas cartas embaralhadas
        gameContainer.innerHTML = '';


        //Função: Esconde a mensagem de vitória (se estiver visível)
        //Detalhe: Garante que a tela de jogo esteja limpa para uma nova partida
        winMessage.style.display = 'none';

        //Loop for que cria as cartas:
        for (let i = 0; i < emojis.length; i++) {
            let box = document.createElement('div');
            box.className = 'item';
            box.innerHTML = shuf_emojis[i];
            box.dataset.emoji = shuf_emojis[i];
            gameContainer.appendChild(box);

            box.addEventListener('click', flipCard);
        }
    }  

    function flipCard() {
        //Função: Verifica se o tabuleiro está "travado"
        //Motivo: Impede que o jogador clique em outras cartas enquanto duas cartas estão sendo comparadas ou animando
        //Se verdadeiro: A função para imediatamente (return)
        if (lockBoard) return;

        //Função: Verifica se o jogador clicou na mesma carta duas vezes
        //Motivo: Impede que uma carta seja selecionada como primeira e segunda carta ao mesmo tempo
        //Se verdadeiro: A função para imediatamente
        if (this === firstCard) return;

        //Função: Verifica se a carta já foi combinada corretamente
        //Motivo: Impede que cartas já combinadas possam ser clicadas novamente
        //Se verdadeiro: A função para imediatamente
        if (this.classList.contains('boxMatch')) return;

        //Função: Vira a carta clicada (adiciona a classe que mostra o emoji)
        //Resultado visual: A carta gira e revela seu conteúdo
        this.classList.add('boxOpen');

        //Primeira carta da jogada:
        //Lógica: Se não há firstCard definida, esta é a primeira carta da jogada
        //Ação: Armazena a carta clicada em firstCard e termina a função
        if (!firstCard) {
            firstCard = this;
            return;
        }

        //Segunda carta da jogada:
        //Armazena a carta em secondCard
        //Incrementa o contador de tentativas
        //Atualiza o display de tentativas
        secondCard = this;
        attempts++;
        attemptsDisplay.textContent = attempts;

        //Chama checkForMatch() para verificar se as cartas são iguais
        checkForMatch();

    }

    function checkForMatch() {
        // Verifica se é um par
        let isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

        // Se for um par(match):
        if (isMatch) {
            disableCards(); // Bloqueia as cartas matched
            matchedPairs++; // Incrementa contador de pares

            // Verifica vitória
            if (matchedPairs === emojis.length / 2) {
                setTimeout(() => {
                    winMessage.style.display = 'flex';
                }, 1000);
            }
        } else { // Se não for um par:
            unflipCards(); // Desvira as cartas
        }
    }


    // Desabilitar cartas combinadas:
    function disableCards() {
        firstCard.classList.add('boxMatch');
        secondCard.classList.add('boxMatch');
        
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }


    // Desvirar cartas não combinadas
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('boxOpen');
            secondCard.classList.remove('boxOpen');
            
            resetBoard();
        }, 1000);
    }

    // Resetar o tabuleiro
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }


    // Reiniciar o jogo
    resetButtons.forEach(button => {
        button.addEventListener('click', initGame);
    });

    // Iniciar o jogo quando a página carregar
    initGame();
});
