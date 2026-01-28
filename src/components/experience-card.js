import React from "react"

/**
 * ExperienceCard Component
 * 
 * Displays professional work experience in a responsive card layout:
 * - Desktop (>768px): 35% left column (company info) + 65% right column (2x2 grid of responsibilities)
 * - Mobile (<768px): Stacked layout with company info on top, responsibilities below in single column
 * 
 * @param {Object} props
 * @param {string} props.company - Company name
 * @param {string} props.position - Job position/title
 * @param {string} props.dateRange - Date range (e.g., "JAN 2021 — AUGUST 2021")
 * @param {string} props.duration - Duration (e.g., "8 months")
 * @param {Array} props.responsibilities - Array of {title, description} objects (max 4)
 */
const ExperienceCard = ({
  company,
  position,
  dateRange,
  duration,
  responsibilities = [],
}) => {
  // Filter out responsibilities that don't have both title and description
  const validResponsibilities = responsibilities.filter(
    (resp) => resp && resp.title && resp.description
  )

  return (
    <div className="experience-card">
      {/* Left Section: Company Info */}
      <div className="experience-card__info">
        <h3 className="experience-card__company">{company}</h3>
        <p className="experience-card__position">{position}</p>
        <p className="experience-card__date">{dateRange}</p>
        <p className="experience-card__duration">{duration}</p>
      </div>

      {/* Divider (desktop only) */}
      <div className="experience-card__divider"></div>

      {/* Right Section: Responsibilities */}
      <div className="experience-card__responsibilities">
        <h4 className="experience-card__responsibilities-title">
          KEY RESPONSIBILITIES
        </h4>
        <div className="responsibilities-grid">
          {validResponsibilities.map((responsibility, index) => (
            <div
              key={index}
              className="responsibility-box"
              dangerouslySetInnerHTML={{
                __html: `
                  <h5 class="responsibility-box__title">${responsibility.title}</h5>
                  <div class="responsibility-box__description">${responsibility.description}</div>
                `,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExperienceCard
