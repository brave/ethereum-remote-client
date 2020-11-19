import React from 'react'
import PropTypes from 'prop-types'

export default function TrezorLogo({ size, width, height, ...props }) {
  const aspectRatio = 3.554617195
  if (!width) {
    width = size
  }

  if (!height) {
    height = width / aspectRatio
  }

  return (
    <svg viewBox="0 0 2567.5 722.3" width={width} height={height} {...props}>
      <path d="M249 0C149.9 0 69.7 80.2 69.7 179.3v67.2C34.9 252.8 0 261.2 0 272.1v350.7s0 9.7 10.9 14.3c39.5 16 194.9 71 230.6 83.6 4.6 1.7 5.9 1.7 7.1 1.7 1.7 0 2.5 0 7.1-1.7 35.7-12.6 191.5-67.6 231-83.6 10.1-4.2 10.5-13.9 10.5-13.9V272.1c0-10.9-34.4-19.7-69.3-25.6v-67.2C428.4 80.2 347.7 0 249 0zm0 85.7c58.4 0 93.7 35.3 93.7 93.7v58.4c-65.5-4.6-121.4-4.6-187.3 0v-58.4c0-58.5 35.3-93.7 93.6-93.7zm-.4 238.1c81.5 0 149.9 6.3 149.9 17.6v218.8c0 3.4-.4 3.8-3.4 5-2.9 1.3-139 50.4-139 50.4s-5.5 1.7-7.1 1.7c-1.7 0-7.1-2.1-7.1-2.1s-136.1-49.1-139-50.4-3.4-1.7-3.4-5V341c-.8-11.3 67.6-17.2 149.1-17.2zM728.466 563.183V323.577h-87.547v-85.922h272.962v85.922h-86.686v239.606h-98.729zM1135.042 563.183l-44.92-102.36h-35.745v102.36h-98.73V237.655h173.756c76.269 0 117.175 50.56 117.175 111.536 0 56.198-32.495 85.922-58.587 98.729l58.97 115.168h-111.919zm11.66-213.992c0-17.681-15.674-25.327-32.113-25.327h-60.212v51.419h60.212c16.439-.382 32.113-8.028 32.113-26.092zM1298.38 563.183V237.655h246.87v85.922h-148.524v32.113h144.892v85.922h-144.892v35.745h148.524v85.826h-246.87zM1596.574 563.566V485.29l124.056-161.33h-124.056v-85.923h254.038v77.512l-124.439 162.19h128.07v85.922l-257.67-.095zM1878.329 400.993c0-99.972 77.511-168.595 178.247-168.595 100.354 0 178.248 68.241 178.248 168.595 0 99.971-77.512 168.212-178.248 168.212s-178.247-68.24-178.247-168.212zm256.14 0c0-45.398-30.87-81.526-78.275-81.526s-78.276 36.128-78.276 81.526 30.87 81.525 78.276 81.525c47.787 0 78.276-36.127 78.276-81.525zM2455.506 563.566l-44.92-102.361h-35.745v102.36h-98.73V238.038h173.756c76.27 0 117.175 50.56 117.175 111.536 0 56.198-32.495 85.922-58.587 98.73l58.97 115.167h-111.919zm12.043-214.375c0-17.681-15.675-25.327-32.114-25.327h-60.212v51.419h60.212c16.535-.382 32.114-8.028 32.114-26.092z" />
    </svg>
  )
}

TrezorLogo.propTypes = {
  size: PropTypes.number,
}

TrezorLogo.defaultProps = {
  size: 100
}