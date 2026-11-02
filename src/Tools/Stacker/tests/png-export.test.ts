import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toPng } from 'html-to-image';
import { exportDiagramAsPng } from '../png-export';

vi.mock('html-to-image', () => ({ toPng: vi.fn() }));

describe('exportDiagramAsPng', () => {
  beforeEach(() => {
    vi.mocked(toPng).mockReset();
  });

  it('creates a high-resolution PNG and downloads it with the expected filename', async () => {
    vi.mocked(toPng).mockResolvedValue('data:image/png;base64,stack');
    const element = document.createElement('div');
    Object.defineProperties(element, {
      scrollWidth: { value: 900 },
      scrollHeight: { value: 280 },
      clientWidth: { value: 800 },
      clientHeight: { value: 260 },
    });
    let downloadedFilename = '';
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      downloadedFilename = this.download;
    });

    await exportDiagramAsPng(element);

    expect(toPng).toHaveBeenCalledWith(element, expect.objectContaining({
      pixelRatio: 2,
      width: 900,
      height: 280,
      canvasWidth: 1800,
      canvasHeight: 560,
    }));
    expect(downloadedFilename).toBe('stacker-stack.png');
    click.mockRestore();
  });

  it('surfaces image generation failures to the caller', async () => {
    vi.mocked(toPng).mockRejectedValue(new Error('canvas unavailable'));

    await expect(exportDiagramAsPng(document.createElement('div'))).rejects.toThrow('canvas unavailable');
  });
});
