import { UserProfile } from '../backend';

export interface MonthlySummaryData {
  userName: string;
  companyName: string;
  month: string;
  totalToReceive: number;
  expenses: number;
  netBalance: number;
  phrase: string;
  monthlyGoal?: number;
  goalAchieved?: boolean;
  goalExceeded?: boolean;
  categoryBreakdown?: Array<{ categoryName: string; tripCount: number }>;
}

export async function generateMonthlySummaryImage(data: MonthlySummaryData): Promise<string> {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('No se pudo crear el contexto del canvas');
    }

    // Set canvas dimensions for better mobile sharing - increased height for category breakdown
    canvas.width = 1080;
    canvas.height = 1700;

    // Sanitize data with safe defaults
    const safeData = {
      userName: data.userName || 'Usuario',
      companyName: data.companyName || 'Mi Empresa',
      month: data.month || new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date()),
      totalToReceive: isNaN(data.totalToReceive) ? 0 : data.totalToReceive,
      expenses: isNaN(data.expenses) ? 0 : Math.abs(data.expenses),
      netBalance: isNaN(data.netBalance) ? 0 : data.netBalance,
      phrase: data.phrase || 'Este es mi resumen mensual',
      monthlyGoal: data.monthlyGoal && data.monthlyGoal > 0 ? data.monthlyGoal : undefined,
      goalAchieved: data.goalAchieved || false,
      goalExceeded: data.goalExceeded || false,
      categoryBreakdown: data.categoryBreakdown || [],
    };

    // Create dynamic gradient background based on achievement status
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (safeData.goalExceeded) {
      // Golden celebration gradient
      gradient.addColorStop(0, '#fbbf24'); // Golden yellow
      gradient.addColorStop(0.3, '#f59e0b'); // Amber
      gradient.addColorStop(0.7, '#1e40af'); // Blue
      gradient.addColorStop(1, '#0d9488'); // Teal
    } else if (safeData.goalAchieved) {
      // Success gradient
      gradient.addColorStop(0, '#10b981'); // Emerald
      gradient.addColorStop(0.4, '#059669'); // Green
      gradient.addColorStop(0.8, '#1e40af'); // Blue
      gradient.addColorStop(1, '#0d9488'); // Teal
    } else if (safeData.netBalance > 0) {
      // Positive gradient
      gradient.addColorStop(0, '#6366f1'); // Indigo
      gradient.addColorStop(0.5, '#1e40af'); // Blue
      gradient.addColorStop(1, '#0d9488'); // Teal
    } else {
      // Neutral/negative gradient
      gradient.addColorStop(0, '#64748b'); // Slate
      gradient.addColorStop(0.5, '#475569'); // Slate dark
      gradient.addColorStop(1, '#334155'); // Slate darker
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add celebration burst pattern for achieved/exceeded goals
    if (safeData.goalAchieved || safeData.goalExceeded) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      const centerX = canvas.width / 2;
      const centerY = 200;
      
      // Create burst rays
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI * 2) / 16;
        const length = 150 + Math.random() * 50;
        const width = 8;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.fillRect(-width/2, 0, width, length);
        ctx.restore();
      }
    }

    // Main content card with enhanced styling
    const cardX = 60;
    const cardY = 120;
    const cardWidth = canvas.width - 120;
    const cardHeight = canvas.height - 240;
    const cornerRadius = 30;

    // Card shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.roundRect(cardX + 8, cardY + 8, cardWidth, cardHeight, cornerRadius);
    ctx.fill();

    // Main card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardWidth, cardHeight, cornerRadius);
    ctx.fill();

    // Achievement header section
    let currentY = 200;
    
    // Large achievement badge/medal for goal achievement
    if (safeData.goalAchieved || safeData.goalExceeded) {
      const badgeSize = safeData.goalExceeded ? 120 : 100;
      const badgeX = canvas.width / 2;
      const badgeY = currentY;
      
      // Outer glow effect
      const glowGradient = ctx.createRadialGradient(badgeX, badgeY, 0, badgeX, badgeY, badgeSize + 20);
      glowGradient.addColorStop(0, safeData.goalExceeded ? 'rgba(251, 191, 36, 0.4)' : 'rgba(16, 185, 129, 0.4)');
      glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeSize + 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Main badge circle
      const badgeGradient = ctx.createRadialGradient(badgeX, badgeY - 10, 0, badgeX, badgeY, badgeSize);
      if (safeData.goalExceeded) {
        badgeGradient.addColorStop(0, '#fef3c7'); // Light golden
        badgeGradient.addColorStop(0.7, '#fbbf24'); // Golden
        badgeGradient.addColorStop(1, '#f59e0b'); // Dark golden
      } else {
        badgeGradient.addColorStop(0, '#d1fae5'); // Light green
        badgeGradient.addColorStop(0.7, '#10b981'); // Green
        badgeGradient.addColorStop(1, '#059669'); // Dark green
      }
      ctx.fillStyle = badgeGradient;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Badge border
      ctx.strokeStyle = safeData.goalExceeded ? '#f59e0b' : '#059669';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeSize - 3, 0, Math.PI * 2);
      ctx.stroke();
      
      // Achievement icon
      ctx.fillStyle = 'white';
      ctx.font = `bold ${safeData.goalExceeded ? '72px' : '60px'} Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const icon = safeData.goalExceeded ? '🏆' : '⭐';
      ctx.fillText(icon, badgeX, badgeY);
      
      // Achievement ribbon
      const ribbonY = badgeY + badgeSize + 30;
      const ribbonWidth = 400;
      const ribbonHeight = 60;
      const ribbonX = badgeX - ribbonWidth / 2;
      
      // Ribbon background
      ctx.fillStyle = safeData.goalExceeded ? '#f59e0b' : '#059669';
      ctx.beginPath();
      ctx.roundRect(ribbonX, ribbonY, ribbonWidth, ribbonHeight, 15);
      ctx.fill();
      
      // Ribbon text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const achievementText = safeData.goalExceeded ? '¡SUPERASTE TU META!' : '¡OBJETIVO LOGRADO!';
      ctx.fillText(achievementText, badgeX, ribbonY + ribbonHeight / 2);
      
      currentY = ribbonY + ribbonHeight + 60;
    } else if (safeData.totalToReceive === 0 && safeData.expenses === 0 && safeData.netBalance === 0) {
      // No data available - show friendly message
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📊 SIN DATOS', canvas.width / 2, currentY);
      
      ctx.fillStyle = '#4f46e5';
      ctx.font = '24px Arial, sans-serif';
      ctx.fillText('Aún no hay registros para este período', canvas.width / 2, currentY + 40);
      
      currentY += 100;
    } else {
      // Progress motivation section
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💪 SIGUE ASÍ', canvas.width / 2, currentY);
      
      ctx.fillStyle = '#4f46e5';
      ctx.font = '24px Arial, sans-serif';
      ctx.fillText('Vas por buen camino', canvas.width / 2, currentY + 40);
      
      currentY += 100;
    }

    // Company and user info section
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(safeData.companyName, canvas.width / 2, currentY);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '24px Arial, sans-serif';
    ctx.fillText(safeData.userName, canvas.width / 2, currentY + 40);
    
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillText(safeData.month.toUpperCase(), canvas.width / 2, currentY + 80);
    
    currentY += 130;

    // *** TRIP CATEGORY BREAKDOWN SECTION - MOST PROMINENT DISPLAY ***
    if (safeData.categoryBreakdown && safeData.categoryBreakdown.length > 0) {
      const breakdownY = currentY;
      
      // Section header with large icon and bold text
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 42px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🚛 DESGLOSE DE VIAJES', canvas.width / 2, breakdownY);
      
      // Decorative line with gradient
      const lineGradient = ctx.createLinearGradient(canvas.width / 2 - 250, breakdownY + 20, canvas.width / 2 + 250, breakdownY + 20);
      lineGradient.addColorStop(0, 'rgba(30, 64, 175, 0)');
      lineGradient.addColorStop(0.5, '#1e40af');
      lineGradient.addColorStop(1, 'rgba(30, 64, 175, 0)');
      ctx.strokeStyle = lineGradient;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 250, breakdownY + 20);
      ctx.lineTo(canvas.width / 2 + 250, breakdownY + 20);
      ctx.stroke();
      
      let breakdownItemY = breakdownY + 70;
      
      // Display each category with EXTRA LARGE, colorful typography
      const categoryColors = ['#6366f1', '#0d9488', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
      
      safeData.categoryBreakdown.forEach((category, index) => {
        if (category.tripCount > 0) {
          const color = categoryColors[index % categoryColors.length];
          const itemX = 120;
          const itemWidth = canvas.width - 240;
          const itemHeight = 90;
          
          // Category item background with gradient
          const itemGradient = ctx.createLinearGradient(itemX, breakdownItemY, itemX + itemWidth, breakdownItemY);
          itemGradient.addColorStop(0, color + '30');
          itemGradient.addColorStop(0.5, color + '20');
          itemGradient.addColorStop(1, color + '30');
          ctx.fillStyle = itemGradient;
          ctx.beginPath();
          ctx.roundRect(itemX, breakdownItemY, itemWidth, itemHeight, 20);
          ctx.fill();
          
          // Category item border with glow
          ctx.shadowColor = color;
          ctx.shadowBlur = 10;
          ctx.strokeStyle = color;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.roundRect(itemX, breakdownItemY, itemWidth, itemHeight, 20);
          ctx.stroke();
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          
          // Category name (left side) - EXTRA LARGE
          ctx.fillStyle = color;
          ctx.font = 'bold 34px Arial, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(`Viajes ${category.categoryName}`, itemX + 30, breakdownItemY + 55);
          
          // Trip count badge (right side) - EXTRA LARGE
          const badgeWidth = 120;
          const badgeHeight = 60;
          const badgeX = itemX + itemWidth - badgeWidth - 25;
          const badgeY = breakdownItemY + (itemHeight - badgeHeight) / 2;
          
          // Badge background with gradient
          const badgeGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY + badgeHeight);
          badgeGradient.addColorStop(0, color);
          badgeGradient.addColorStop(1, color + 'DD');
          ctx.fillStyle = badgeGradient;
          ctx.beginPath();
          ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 12);
          ctx.fill();
          
          // Badge border
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 12);
          ctx.stroke();
          
          // Badge text - EXTRA LARGE AND BOLD
          ctx.fillStyle = 'white';
          ctx.font = 'bold 42px Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${category.tripCount}`, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);
          
          breakdownItemY += itemHeight + 20;
        }
      });
      
      currentY = breakdownItemY + 30;
    }

    // Large colorful financial numbers section
    const numberSectionY = currentY;
    const numberBoxWidth = 300;
    const numberBoxHeight = 120;
    const numberSpacing = 30;
    
    // Helper function to draw number boxes
    const drawNumberBox = (x: number, y: number, label: string, amount: number, color: string, icon: string) => {
      // Box background with gradient
      const boxGradient = ctx.createLinearGradient(x, y, x, y + numberBoxHeight);
      boxGradient.addColorStop(0, color);
      boxGradient.addColorStop(1, color + 'CC'); // Add transparency
      ctx.fillStyle = boxGradient;
      ctx.beginPath();
      ctx.roundRect(x, y, numberBoxWidth, numberBoxHeight, 20);
      ctx.fill();
      
      // Box border
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(x, y, numberBoxWidth, numberBoxHeight, 20);
      ctx.stroke();
      
      // Icon
      ctx.fillStyle = 'white';
      ctx.font = '32px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(icon, x + 20, y + 45);
      
      // Label
      ctx.fillStyle = 'white';
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.fillText(label, x + 70, y + 30);
      
      // Amount (large and bold)
      ctx.fillStyle = 'white';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.textAlign = 'right';
      const displayAmount = isNaN(amount) ? 0 : Math.abs(amount);
      ctx.fillText(`€${displayAmount.toFixed(0)}`, x + numberBoxWidth - 20, y + 75);
    };

    // Total to receive (green)
    drawNumberBox(
      (canvas.width - numberBoxWidth) / 2, 
      numberSectionY, 
      'TOTAL A RECIBIR', 
      safeData.totalToReceive, 
      '#10b981', 
      '💰'
    );

    // Expenses (red)
    drawNumberBox(
      (canvas.width - numberBoxWidth) / 2, 
      numberSectionY + numberBoxHeight + numberSpacing, 
      'GASTOS', 
      safeData.expenses, 
      '#ef4444', 
      '📉'
    );

    // Net balance (dynamic color based on positive/negative)
    const balanceColor = safeData.netBalance >= 0 ? '#059669' : '#dc2626';
    const balanceY = numberSectionY + (numberBoxHeight + numberSpacing) * 2;
    
    // Special styling for net balance
    const balanceBoxHeight = 140;
    const balanceGradient = ctx.createLinearGradient(
      (canvas.width - numberBoxWidth) / 2, 
      balanceY, 
      (canvas.width - numberBoxWidth) / 2, 
      balanceY + balanceBoxHeight
    );
    balanceGradient.addColorStop(0, balanceColor);
    balanceGradient.addColorStop(1, balanceColor + 'DD');
    
    ctx.fillStyle = balanceGradient;
    ctx.beginPath();
    ctx.roundRect((canvas.width - numberBoxWidth) / 2, balanceY, numberBoxWidth, balanceBoxHeight, 25);
    ctx.fill();
    
    // Balance border with glow effect
    ctx.shadowColor = balanceColor;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = balanceColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect((canvas.width - numberBoxWidth) / 2, balanceY, numberBoxWidth, balanceBoxHeight, 25);
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // Balance content
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('💎', (canvas.width - numberBoxWidth) / 2 + 20, balanceY + 50);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText('BALANCE NETO', (canvas.width - numberBoxWidth) / 2 + 80, balanceY + 35);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.textAlign = 'right';
    const displayBalance = isNaN(safeData.netBalance) ? 0 : safeData.netBalance;
    ctx.fillText(`€${displayBalance.toFixed(0)}`, (canvas.width - numberBoxWidth) / 2 + numberBoxWidth - 20, balanceY + 90);

    currentY = balanceY + balanceBoxHeight + 50;

    // Goal progress section (if applicable)
    if (safeData.monthlyGoal && safeData.monthlyGoal > 0) {
      const goalY = currentY;
      
      // Goal progress bar
      const progressBarWidth = numberBoxWidth;
      const progressBarHeight = 20;
      const progressBarX = (canvas.width - progressBarWidth) / 2;
      
      // Background bar
      ctx.fillStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.roundRect(progressBarX, goalY, progressBarWidth, progressBarHeight, 10);
      ctx.fill();
      
      // Progress fill
      const progress = Math.min((safeData.netBalance / safeData.monthlyGoal) * 100, 100);
      const progressWidth = (progressBarWidth * Math.max(0, progress)) / 100;
      
      const progressGradient = ctx.createLinearGradient(progressBarX, goalY, progressBarX + progressWidth, goalY);
      if (safeData.goalExceeded) {
        progressGradient.addColorStop(0, '#fbbf24');
        progressGradient.addColorStop(1, '#f59e0b');
      } else if (safeData.goalAchieved) {
        progressGradient.addColorStop(0, '#10b981');
        progressGradient.addColorStop(1, '#059669');
      } else {
        progressGradient.addColorStop(0, '#6366f1');
        progressGradient.addColorStop(1, '#4f46e5');
      }
      
      ctx.fillStyle = progressGradient;
      ctx.beginPath();
      ctx.roundRect(progressBarX, goalY, progressWidth, progressBarHeight, 10);
      ctx.fill();
      
      // Goal text
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.textAlign = 'center';
      const displayProgress = isNaN(progress) ? 0 : Math.max(0, progress);
      ctx.fillText(`Meta: €${safeData.monthlyGoal.toFixed(0)} | Progreso: ${displayProgress.toFixed(0)}%`, canvas.width / 2, goalY + 50);
      
      currentY = goalY + 80;
    }

    // Celebration confetti for exceeded goals
    if (safeData.goalExceeded) {
      const confettiColors = ['#fbbf24', '#f59e0b', '#10b981', '#6366f1', '#ef4444'];
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 8 + 4;
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        
        ctx.fillStyle = color;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.random() * Math.PI * 2);
        ctx.fillRect(-size/2, -size/2, size, size);
        ctx.restore();
      }
    }

    // Motivational phrase at the bottom
    ctx.fillStyle = '#6b7280';
    ctx.font = 'italic 20px Arial, sans-serif';
    ctx.textAlign = 'center';
    const maxPhraseWidth = canvas.width - 120;
    const words = safeData.phrase.split(' ');
    let line = '';
    let phraseY = canvas.height - 120;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxPhraseWidth && i > 0) {
        ctx.fillText(`"${line.trim()}"`, canvas.width / 2, phraseY);
        line = words[i] + ' ';
        phraseY += 30;
      } else {
        line = testLine;
      }
    }
    if (line.trim()) {
      ctx.fillText(`"${line.trim()}"`, canvas.width / 2, phraseY);
    }

    // Footer with date
    ctx.fillStyle = '#9ca3af';
    ctx.font = '16px Arial, sans-serif';
    ctx.textAlign = 'center';
    const currentDate = new Date().toLocaleDateString('es-ES');
    ctx.fillText(`Generado el ${currentDate} • Caffeine.ai`, canvas.width / 2, canvas.height - 60);

    // Convert canvas to blob URL
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject(new Error('Error al generar la imagen'));
        }
      }, 'image/png', 0.95);
    });
  } catch (error) {
    console.error('Error in generateMonthlySummaryImage:', error);
    // Return a fallback error - but this should never happen with our safe defaults
    throw new Error('No se pudo generar la imagen del resumen. Por favor, inténtalo de nuevo.');
  }
}

export function downloadImage(imageUrl: string, filename: string) {
  try {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('No se pudo descargar la imagen');
  }
}

export async function shareImage(imageUrl: string, title: string) {
  try {
    if (navigator.share && navigator.canShare) {
      try {
        // Convert blob URL to actual blob for sharing
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'resumen-mensual.png', { type: 'image/png' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: title,
            files: [file]
          });
          return;
        }
      } catch (error) {
        console.warn('Error sharing image via Web Share API:', error);
      }
    }
    
    // Fallback: copy to clipboard or download
    if (navigator.clipboard && window.ClipboardItem) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        return;
      } catch (error) {
        console.warn('Error copying to clipboard:', error);
      }
    }
    
    // Final fallback: download
    downloadImage(imageUrl, 'resumen-mensual.png');
  } catch (error) {
    console.error('Error sharing image:', error);
    // Final fallback - just download
    downloadImage(imageUrl, 'resumen-mensual.png');
  }
}
