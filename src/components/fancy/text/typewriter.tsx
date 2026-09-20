import { ElementType, useEffect, useRef, useState } from "react"
import { motion, Variants } from "motion/react"

import { cn } from "@/lib/utils"

interface TypewriterProps {
  /**
   * Text or array of texts to type out
   */
  text: string | string[]

  /**
   * HTML Tag to render the component as
   * @default div
   */
  as?: ElementType

  /**
   * Speed of typing in milliseconds
   * @default 50
   */
  speed?: number

  /**
   * Initial delay before typing starts
   * @default 0
   */
  initialDelay?: number

  /**
   * Time to wait between typing and deleting
   * @default 2000
   */
  waitTime?: number

  /**
   * Delay before the next cycle starts after deletion
   * @default 500
   */
  restartDelay?: number

  /**
   * Speed of deleting characters
   * @default 30
   */
  deleteSpeed?: number

  /**
   * Whether to loop through texts array
   * @default true
   */
  loop?: boolean

  /**
   * Optional class name for styling
   */
  className?: string

  /**
   * Whether to show the cursor
   * @default true
   */
  showCursor?: boolean

  /**
   * Hide cursor while typing
   * @default false
   */
  hideCursorOnType?: boolean

  /**
   * Character or React node to use as cursor
   * @default "|"
   */
  cursorChar?: string | React.ReactNode

  /**
   * Animation variants for cursor
   */
  cursorAnimationVariants?: {
    initial: Variants["initial"]
    animate: Variants["animate"]
  }

  /**
   * Optional class name for cursor styling
   */
  cursorClassName?: string
}

const Typewriter = ({
  text,
  as: Tag = "div",
  speed = 50,
  initialDelay = 0,
  waitTime = 2000,
  restartDelay = 500,
  deleteSpeed = 30,
  loop = true,
  className,
  showCursor = true,
  hideCursorOnType = false,
  cursorChar = "|",
  cursorClassName = "ml-1",
  cursorAnimationVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.01,
        repeat: Infinity,
        repeatDelay: 0.4,
        repeatType: "reverse",
      },
    },
  },
  ...props
}: TypewriterProps & React.HTMLAttributes<HTMLElement>) => {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isRestarting, setIsRestarting] = useState(false)
  const hasStarted = useRef(false)

  const texts = Array.isArray(text) ? text : [text]

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const currentText = texts[currentTextIndex]

    if (isRestarting) {
      timeout = setTimeout(() => setIsRestarting(false), restartDelay)
      return () => clearTimeout(timeout)
    }

    const startTyping = () => {
      if (isDeleting) {
        if (displayText === "") {
          if (currentTextIndex === texts.length - 1 && !loop) {
            return
          }

          const nextIndex = (currentTextIndex + 1) % texts.length
          const nextTextIndex = texts[nextIndex] === ""
            ? (nextIndex + 1) % texts.length
            : nextIndex

          setIsDeleting(false)
          setIsRestarting(true)
          setCurrentTextIndex(nextTextIndex)
          setCurrentIndex(0)
        } else {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev.slice(0, -1))
          }, deleteSpeed)
        }
      } else {
        if (currentIndex < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev + currentText[currentIndex])
            setCurrentIndex((prev) => prev + 1)
          }, speed)
        } else if (texts.length > 1) {
          timeout = setTimeout(() => {
            setIsDeleting(true)
          }, waitTime)
        }
      }
    }

    // Apply initial delay only at the start
    if (currentIndex === 0 && !isDeleting && displayText === "") {
      timeout = setTimeout(
        startTyping,
        hasStarted.current ? 0 : initialDelay
      )
      hasStarted.current = true
    } else {
      startTyping()
    }

    return () => clearTimeout(timeout)
  }, [
    currentIndex,
    displayText,
    isDeleting,
    speed,
    deleteSpeed,
    waitTime,
    texts,
    currentTextIndex,
    loop,
    isRestarting,
    restartDelay,
  ])

  return (
    <Tag className={cn("inline whitespace-pre-wrap tracking-tight", className)} {...props}>
      <span>{displayText}</span>
      {showCursor && (
        <motion.span
          variants={cursorAnimationVariants}
          className={cn(
            cursorClassName,
            hideCursorOnType &&
              (currentIndex < texts[currentTextIndex].length || isDeleting)
              ? "hidden"
              : ""
          )}
          initial="initial"
          animate="animate"
        >
          {cursorChar}
        </motion.span>
      )}
    </Tag>
  )
}

export default Typewriter
