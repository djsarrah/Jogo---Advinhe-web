import styles from "./app.module.css"

import { useEffect, useState } from "react"
import { WORDS, Challenge } from "./utils/words"

import { Tip } from "./components/Tip"
import { Header } from "./components/Header"
import { Letter } from "./components/Letter"
import { Input } from "./components/Input"
import { Button } from "./components/Button"
import { LettersUsed, LettersUsedProps } from "./components/LettersUsed"

const ATTEMPT_MARGIN = 5

export default function App() {
  const [score, setScore] = useState(0)
  const [letter, setLetter] = useState("")
  const[lettersUsed, setLettersUsed] = useState<LettersUsedProps[]>([])
  const[challenge, setChallenge] = useState<Challenge | null>(null)

  // const ATTEMPT_LIMIT = challenge?.word.length + 5


  function handleRestartGame(){
    // alert("Reiniciar o jogo!")
    const isConfirmed = window.confirm("Você tem certeza que deseja reiniciar? Isso apagará todo o progresso atual")

    if (isConfirmed) {
      startGame()
    }
  }

  function startGame(){
    const index = Math.floor(Math.random() * WORDS.length)
    const randomWord = WORDS[index]

    setChallenge(randomWord)

    setScore(0)
    setLetter("")
    setLettersUsed([])
  }

function handleConfirm(){
  if(!challenge){
    return
  }
    
  if(!letter.trim()) {
    return alert("Digite uma letra!")
  }

  const value = letter.toUpperCase ()
  const exists = lettersUsed.find((used) =>used.value.toUpperCase() === value)

  if(exists){
    setLetter("")
    return alert("Você já utilizou a letra " + value )
  }

  const hits = challenge.word.toUpperCase().split("").filter((char) => char === value).length

  const correct = hits > 0

  const currentScore= score + hits

  setLettersUsed((prevState) => [...prevState, {value, correct}])
  setScore(currentScore)

  setLetter("")
}  

function endGame (message: string){
  alert(message)
  startGame()
}

useEffect(() => {
  startGame()
}, [])

useEffect(( ) => {
  if(!challenge){
    return
  }

  setTimeout(() => {
    if(score === challenge.word.length){
      return endGame("Parabéns, você descobriu a palavra!")
    }

    const attemptLimit = challenge.word.length + ATTEMPT_MARGIN
    if(lettersUsed.length === attemptLimit) {
      return endGame("Que pena, não foi dessa vez!")
    }
  }, 200)

}, [score, lettersUsed.length])

if(!challenge){
  return
}

  return(
    <div className={styles.container}>
      <main>
        <Header 
        current={lettersUsed.length} 
        max={challenge.word.length + ATTEMPT_MARGIN} 
        onRestart={handleRestartGame} 
        />

        <Tip tip={challenge.tip}/>

        <div className={styles.word}>
          {
            challenge.word.split("").map((letter, index) => {
              const letterUsed = lettersUsed.find(
                (used) => used.value.toUpperCase() === letter.toUpperCase()
              )

              return <Letter key={index} value={letterUsed?.value} color={letterUsed?.correct ? "correct" : "default"} />
            })}
        </div>

          <h4>Palpite</h4>
          <div className={styles.guess}>
            <Input 
            autoFocus 
            maxLength={1} 
            placeholder="?" 
            value={letter}
            onChange={(e)=> setLetter(e.target.value)}/>

            <Button 
            title="Confirmar" 
            onClick={handleConfirm}/>
          </div>
          <LettersUsed data={lettersUsed} />     
      </main>
    </div>
  )
}
