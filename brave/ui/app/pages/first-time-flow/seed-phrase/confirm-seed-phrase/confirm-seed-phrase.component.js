import React from 'react'
import ConfirmSeedPhrase from '../../../../../../../ui/app/pages/first-time-flow/seed-phrase/confirm-seed-phrase/confirm-seed-phrase.component'
import DraggableSeed from '../../../../../../../ui/app/pages/first-time-flow/seed-phrase/confirm-seed-phrase/draggable-seed.component'
import classnames from 'classnames'
import {
  INITIALIZE_END_OF_FLOW_ROUTE,
  DEFAULT_ROUTE,
} from '../../../../../../../ui/app/helpers/constants/routes'

const EMPTY_SEEDS = Array(24).fill(null)

module.exports = class BraveConfirmSeedPhrase extends ConfirmSeedPhrase {

  handleSubmit = async () => {
    const {
      history,
      setSeedPhraseBackedUp,
      showingSeedPhraseBackupAfterOnboarding,
      hideSeedPhraseBackupAfterOnboarding,
    } = this.props

    if (!this.isValid()) {
      return
    }

    try {
      setSeedPhraseBackedUp(true).then(() => {
        if (showingSeedPhraseBackupAfterOnboarding) {
          hideSeedPhraseBackupAfterOnboarding()
          history.push(DEFAULT_ROUTE)
        } else {
          history.push(INITIALIZE_END_OF_FLOW_ROUTE)
        }
      })
    } catch ({ message }) {
      console.error(message)
    }
  }

  onDrop = targetIndex => {
    const {
      selectedSeedIndices,
      draggingSeedIndex,
    } = this.state

    const indices = insert(selectedSeedIndices, draggingSeedIndex, targetIndex, true)

    this.setState({
      selectedSeedIndices: indices,
      pendingSeedIndices: indices,
      draggingSeedIndex: -1,
      hoveringIndex: -1,
    })
  }

  renderSelectedSeeds () {
    const { shuffledSeedWords, selectedSeedIndices, draggingSeedIndex } = this.state
    return EMPTY_SEEDS.map((_, index) => {
      const seedIndex = selectedSeedIndices[index]
      const word = shuffledSeedWords[seedIndex]

      return (
        <DraggableSeed
          key={`selected-${seedIndex}-${index}`}
          className="confirm-seed-phrase__selected-seed-words__selected-seed"
          index={index}
          seedIndex={seedIndex}
          word={word}
          draggingSeedIndex={draggingSeedIndex}
          setDraggingSeedIndex={this.setDraggingSeedIndex}
          setHoveringIndex={this.setHoveringIndex}
          onDrop={this.onDrop}
          draggable
        />
      )
    })
  }

  renderPendingSeeds () {
    const {
      pendingSeedIndices,
      shuffledSeedWords,
      draggingSeedIndex,
      hoveringIndex,
    } = this.state

    const indices = insert(pendingSeedIndices, draggingSeedIndex, hoveringIndex)

    return EMPTY_SEEDS.map((_, index) => {
      const seedIndex = indices[index]
      const word = shuffledSeedWords[seedIndex]

      return (
        <DraggableSeed
          key={`pending-${seedIndex}-${index}`}
          index={index}
          className={classnames('confirm-seed-phrase__selected-seed-words__pending-seed', {
            'confirm-seed-phrase__seed-word--hidden': draggingSeedIndex === seedIndex && index !== hoveringIndex,
          })}
          seedIndex={seedIndex}
          word={word}
          draggingSeedIndex={draggingSeedIndex}
          setDraggingSeedIndex={this.setDraggingSeedIndex}
          setHoveringIndex={this.setHoveringIndex}
          onDrop={this.onDrop}
          droppable={!!word}
        />
      )
    })
  }
}

function insert (list, value, target, removeOld) {
  let nextList = [...list]

  if (typeof list[target] === 'number') {
    nextList = [...list.slice(0, target), value, ...list.slice(target)]
  }

  if (removeOld) {
    nextList = nextList.filter((seed, i) => {
      return seed !== value || i === target
    })
  }

  if (nextList.length > 24) {
    nextList.pop()
  }

  return nextList
}
