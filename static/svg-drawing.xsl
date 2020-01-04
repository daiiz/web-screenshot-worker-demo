<!-- ref: https://svg-drawing.herokuapp.com/xml/web-image-v1.1.xsl -->
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <xsl:attribute name='width'>
        <xsl:value-of select="web-image/natural-width"/>
      </xsl:attribute>
      <xsl:attribute name='height'>
        <xsl:value-of select="web-image/natural-height"/>
      </xsl:attribute>
      <xsl:attribute name='viewBox'>
        <xsl:text>0</xsl:text>
        <xsl:text> </xsl:text>
        <xsl:text>0</xsl:text>
        <xsl:text> </xsl:text>
        <xsl:value-of select="web-image/natural-width"/>
        <xsl:text> </xsl:text>
        <xsl:value-of select="web-image/natural-height"/>
      </xsl:attribute>

      <style>
        path { opacity: 0; }
        @keyframes turn_on {
          100% { opacity: 1; }
        }
      </style>

      <xsl:for-each select="web-image/paths/path">
        <xsl:variable name="i" select="position()"/>
        <style>
          <xsl:text>path:nth-child(</xsl:text><xsl:value-of select="$i"/><xsl:text>) {</xsl:text>
          <xsl:text>animation: turn_on .1s ease-out </xsl:text><xsl:value-of select="$i*0.1"/><xsl:text>s 1 forwards;</xsl:text>
          <xsl:text>}</xsl:text>
        </style>
      </xsl:for-each>

      <rect width="100%" height="100%">
        <xsl:attribute name='fill'>
          <xsl:value-of select="web-image/background-color/@rgba"/>
        </xsl:attribute>
      </rect>

      <g>
        <xsl:for-each select="web-image/paths/path">
          <path xmlns="http://www.w3.org/2000/svg" fill="transparent">
            <xsl:attribute name='stroke'>
              <xsl:value-of select="stroke-round/@rgba"/>
            </xsl:attribute>
            <xsl:attribute name='stroke-width'>
              <xsl:value-of select="stroke-round/@width"/>
            </xsl:attribute>
            <xsl:attribute name='stroke-linecap'>
              <xsl:text>round</xsl:text>
            </xsl:attribute>
            <xsl:attribute name='stroke-linejoin'>
              <xsl:text>round</xsl:text>
            </xsl:attribute>
            <xsl:attribute name='data-start'>
              <xsl:value-of select="start"/>
            </xsl:attribute>
            <xsl:attribute name='data-end'>
              <xsl:value-of select="end"/>
            </xsl:attribute>
            <xsl:attribute name='data-left'>
              <xsl:value-of select="left"/>
            </xsl:attribute>
            <xsl:attribute name='data-right'>
              <xsl:value-of select="right"/>
            </xsl:attribute>
            <xsl:attribute name='data-top'>
              <xsl:value-of select="top"/>
            </xsl:attribute>
            <xsl:attribute name='data-bottom'>
              <xsl:value-of select="bottom"/>
            </xsl:attribute>
            <xsl:attribute name='data-left-top'>
              <xsl:value-of select="left-top"/>
            </xsl:attribute>
            <xsl:attribute name='data-right-bottom'>
              <xsl:value-of select="right-bottom"/>
            </xsl:attribute>
            <xsl:attribute name='data-time'>
              <xsl:value-of select="time"/>
            </xsl:attribute>
            <xsl:attribute name='d'>
              <xsl:choose>
                <xsl:when test="count(points/point) > 0">
                  <xsl:for-each select="points/point">
                    <xsl:variable name="index" select="position() - 1"/>
                    <xsl:choose>
                      <xsl:when test="$index = 0">
                        <xsl:text>M</xsl:text>
                        <xsl:value-of select="x"/>
                        <xsl:text>,</xsl:text>
                        <xsl:value-of select="y"/>
                        <xsl:text> </xsl:text>
                        <xsl:text>L</xsl:text>
                        <xsl:value-of select="x"/>
                        <xsl:text>,</xsl:text>
                        <xsl:value-of select="y"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="x"/>
                        <xsl:text>,</xsl:text>
                        <xsl:value-of select="y"/>
                      </xsl:otherwise>
                    </xsl:choose>
                    <xsl:text> </xsl:text>
                  </xsl:for-each>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:value-of select="points" /> <!-- Legacy v0 -->
                </xsl:otherwise>
              </xsl:choose>
            </xsl:attribute>
          </path>
        </xsl:for-each>
      </g>
    </svg>
  </xsl:template>
</xsl:stylesheet>
