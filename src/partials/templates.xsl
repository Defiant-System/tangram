<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:template name="start-view">
		<div class="frame" data-click="select-level">
			<div class="reel" data-world="1">
				<xsl:call-template name="world-levels"/>
			</div>
		</div>
		<xsl:call-template name="levels-nav"/>
	</xsl:template>


	<xsl:template name="world-levels">
		<xsl:for-each select="./*">
			<ul class="world">
				<xsl:for-each select="./i">
				<li>
					<xsl:if test="../@id = '1' and @id = '1'">
						<xsl:attribute name="class">unlocked</xsl:attribute>
					</xsl:if>
					<xsl:attribute name="data-id"><xsl:value-of select="../@id"/>.<xsl:value-of select="@id"/></xsl:attribute>
				</li>
				</xsl:for-each>
			</ul>
		</xsl:for-each>
	</xsl:template>


	<xsl:template name="levels-nav">
		<ul class="nav" data-click="select-world">
			<xsl:for-each select="./*">
			<li>
				<xsl:if test="position() = 1">
					<xsl:attribute name="class">active</xsl:attribute>
				</xsl:if>
			</li>
			</xsl:for-each>
		</ul>
	</xsl:template>

</xsl:stylesheet>